import { Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { MapFileCustomMetadata, MapFileRevision } from '@osf/features/files/mappers';
import {
  FileCustomMetadata,
  GetCustomMetadataResponse,
  GetFileMetadataResponse,
  GetFileRevisionsResponse,
  GetShortInfoResponse,
  OsfFileCustomMetadata,
  OsfFileRevision,
  PatchFileMetadata,
} from '@osf/features/files/models';
import {
  AddonGetResponseJsonApi,
  AddonModel,
  ApiData,
  ConfiguredAddonGetResponseJsonApi,
  ConfiguredAddonModel,
  ContributorModel,
  ContributorsResponseJsonApi,
  FileDetailsModel,
  FileDetailsResponseJsonApi,
  FileFolderDataJsonApi,
  FileFolderModel,
  FileFolderResponseJsonApi,
  FileFoldersResponseJsonApi,
  FileModel,
  FileResponseJsonApi,
  FilesResponseJsonApi,
  FileVersionModel,
  FileVersionsResponseJsonApi,
  JsonApiResponse,
  MetaJsonApi,
} from '@shared/models';

import { FileKind } from '../enums';
import { AddonMapper, ContributorsMapper, FilesMapper } from '../mappers';

import { JsonApiService } from './json-api.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  readonly jsonApiService = inject(JsonApiService);
  readonly toastService = inject(ToastService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  get addonsApiUrl() {
    return this.environment.addonsApiUrl;
  }

  filesFields = 'name,guid,kind,extra,size,path,materialized_path,date_modified,parent_folder,files';

  getFiles(
    filesLink: string,
    search: string,
    sort: string,
    page = 1
  ): Observable<{ files: FileModel[]; meta?: MetaJsonApi }> {
    const params: Record<string, string> = {
      sort: sort,
      page: page.toString(),
      'fields[files]': this.filesFields,
      'filter[name]': search,
    };

    return this.jsonApiService
      .get<FilesResponseJsonApi>(`${filesLink}`, params)
      .pipe(map((response) => ({ files: FilesMapper.getFiles(response.data), meta: response.meta })));
  }

  getFolders(folderLink: string): Observable<{ files: FileFolderModel[]; meta?: MetaJsonApi }> {
    return this.jsonApiService
      .get<FileFoldersResponseJsonApi>(`${folderLink}`)
      .pipe(map((response) => ({ files: FilesMapper.getFileFolders(response.data), meta: response.meta })));
  }

  getFilesWithoutFiltering(filesLink: string): Observable<FileModel[]> {
    return this.jsonApiService
      .get<FilesResponseJsonApi>(filesLink)
      .pipe(map((response) => FilesMapper.getFiles(response.data)));
  }

  uploadFile(
    file: File,
    uploadLink: string,
    isUpdate = false
  ): Observable<HttpEvent<JsonApiResponse<FileModel, null>>> {
    const params = isUpdate
      ? undefined
      : {
          kind: FileKind.File,
          name: file.name,
        };

    return this.jsonApiService.putFile(uploadLink, file, params);
  }

  updateFileContent(file: File, link: string) {
    const params = {
      kind: 'file',
    };

    return this.jsonApiService.put(link, file, params);
  }

  createFolder(link: string, folderName: string) {
    return this.jsonApiService.put<FileFolderDataJsonApi>(link, null, { name: folderName });
  }

  getFolder(link: string): Observable<FileFolderModel> {
    return this.jsonApiService
      .get<FileFolderResponseJsonApi>(link)
      .pipe(map((response) => FilesMapper.getFileFolder(response.data)));
  }

  deleteEntry(link: string) {
    return this.jsonApiService.delete(link).pipe();
  }

  renameEntry(link: string, name: string, conflict = ''): Observable<FileModel> {
    const body = {
      action: 'rename',
      rename: name,
      conflict,
    };
    return this.jsonApiService.post(link, body);
  }

  moveFile(link: string, path: string, resourceId: string, provider: string, action: string, replace?: boolean) {
    const body = {
      action: action,
      path: path,
      provider: provider,
      resource: resourceId,
      conflict: replace ? 'replace' : undefined,
    };

    return this.jsonApiService.post<FileResponseJsonApi>(link, body);
  }

  getFolderDownloadLink(link: string): string {
    const separator = link.includes('?') ? '&' : '?';
    return `${link}${separator}zip=`;
  }

  getFileTarget(fileGuid: string): Observable<FileDetailsModel> {
    return this.jsonApiService
      .get<FileDetailsResponseJsonApi>(`${this.apiUrl}/files/${fileGuid}/?embed=target`)
      .pipe(map((response) => FilesMapper.getFileDetails(response.data)));
  }

  getFileGuid(id: string): Observable<FileModel> {
    const params = {
      create_guid: 'true',
    };

    return this.jsonApiService
      .get<FileResponseJsonApi>(`${this.apiUrl}/files/${id}/`, params)
      .pipe(map((response) => FilesMapper.getFile(response.data)));
  }

  getFileById(fileGuid: string): Observable<FileModel> {
    return this.jsonApiService
      .get<FileResponseJsonApi>(`${this.apiUrl}/files/${fileGuid}/`)
      .pipe(map((response) => FilesMapper.getFile(response.data)));
  }

  getFileVersions(fileGuid: string): Observable<FileVersionModel[]> {
    const params = {
      sort: '-id',
      'page[size]': 50,
    };

    return this.jsonApiService
      .get<FileVersionsResponseJsonApi>(`${this.apiUrl}/files/${fileGuid}/versions/`, params)
      .pipe(map((response) => FilesMapper.getFileVersions(response)));
  }

  getFileMetadata(fileGuid: string): Observable<OsfFileCustomMetadata> {
    return this.jsonApiService
      .get<GetFileMetadataResponse>(`${this.apiUrl}/custom_file_metadata_records/${fileGuid}/`)
      .pipe(map((response) => MapFileCustomMetadata(response.data)));
  }

  getResourceShortInfo(resourceId: string, resourceType: string): Observable<GetShortInfoResponse> {
    const params = {
      'fields[nodes]': 'title,description,date_created,date_modified,identifiers',
      embed: 'identifiers',
    };
    return this.jsonApiService.get<GetShortInfoResponse>(`${this.apiUrl}/${resourceType}/${resourceId}/`, params);
  }

  getCustomMetadata(resourceId: string): Observable<GetCustomMetadataResponse> {
    return this.jsonApiService.get<GetCustomMetadataResponse>(
      `${this.apiUrl}/guids/${resourceId}/?embed=custom_metadata&resolve=false`
    );
  }

  getResourceContributors(resourceId: string, resourceType: string): Observable<ContributorModel[]> {
    return this.jsonApiService
      .get<ContributorsResponseJsonApi>(`${this.apiUrl}/${resourceType}/${resourceId}/bibliographic_contributors/`)
      .pipe(map((response) => ContributorsMapper.getContributors(response.data)));
  }

  patchFileMetadata(data: PatchFileMetadata, fileGuid: string): Observable<OsfFileCustomMetadata> {
    const payload = {
      data: {
        id: fileGuid,
        type: 'custom_file_metadata_records',
        attributes: data,
      },
    };

    return this.jsonApiService
      .patch<
        ApiData<FileCustomMetadata, null, null, null>
      >(`${this.apiUrl}/custom_file_metadata_records/${fileGuid}/`, payload)
      .pipe(map((response) => MapFileCustomMetadata(response)));
  }

  getFileRevisions(link: string): Observable<OsfFileRevision[]> {
    const separator = link.includes('?') ? '&' : '?';
    const urlWithRevisions = `${link}${separator}revisions=`;

    return this.jsonApiService
      .get<GetFileRevisionsResponse>(urlWithRevisions)
      .pipe(map((response) => MapFileRevision(response.data)));
  }

  updateTags(tags: string[], fileGuid: string): Observable<FileDetailsModel> {
    const payload = {
      data: {
        id: fileGuid,
        type: 'files',
        relationships: {},
        attributes: {
          tags: tags,
        },
      },
    };

    return this.jsonApiService
      .patch<FileDetailsResponseJsonApi>(`${this.apiUrl}/files/${fileGuid}/`, payload)
      .pipe(map((response) => FilesMapper.getFileDetails(response.data)));
  }

  copyFileToAnotherLocation(moveLink: string, provider: string, resourceId: string) {
    const body = {
      action: 'copy',
      conflict: 'replace',
      path: '/',
      provider,
      resource: resourceId,
    };

    return this.jsonApiService
      .post<FileResponseJsonApi>(moveLink, body)
      .pipe(map((response) => FilesMapper.getFile(response.data)));
  }

  getResourceReferences(resourceUri: string): Observable<string> {
    const params = {
      'filter[resource_uri]': resourceUri,
    };

    return this.jsonApiService
      .get<
        JsonApiResponse<ApiData<null, null, null, { self: string }>[], null>
      >(`${this.addonsApiUrl}/resource-references`, params)
      .pipe(map((response) => response.data?.[0]?.links?.self ?? ''));
  }

  getConfiguredStorageAddons(resourceUri: string): Observable<ConfiguredAddonModel[]> {
    return this.getResourceReferences(resourceUri).pipe(
      switchMap((referenceUrl: string) => {
        if (!referenceUrl) return of([]);
        return this.jsonApiService
          .get<JsonApiResponse<ConfiguredAddonGetResponseJsonApi[], null>>(`${referenceUrl}/configured_storage_addons`)
          .pipe(map((response) => response.data.map((item) => AddonMapper.fromConfiguredAddonResponse(item))));
      })
    );
  }

  getExternalStorageService(serviceId: string): Observable<AddonModel> {
    return this.jsonApiService
      .get<
        JsonApiResponse<AddonGetResponseJsonApi, null>
      >(`${this.addonsApiUrl}/configured-storage-addons/${serviceId}/external_storage_service/`)
      .pipe(map((response) => AddonMapper.fromResponse(response.data)));
  }
}
