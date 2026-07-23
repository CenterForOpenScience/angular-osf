import { Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@osf/core/provider/environment.provider';
import { MapFileCustomMetadata } from '@osf/features/files/mappers/file-custom-metadata.mapper';
import { MapFileRevision } from '@osf/features/files/mappers/file-revision.mapper';
import { OsfFileCustomMetadata } from '@osf/features/files/models/file-custom-metadata.model';
import {
  FileCustomMetadataDataJsonApi,
  FileMetadataResponse,
} from '@osf/features/files/models/file-metadata-response.model';
import { OsfFileRevision } from '@osf/features/files/models/file-revisions.model';
import { FileRevisionsResponse } from '@osf/features/files/models/file-revisions-response.model';
import { NodeShortInfoResponse } from '@osf/features/files/models/node-short-info-response.model';
import { PatchFileMetadata } from '@osf/features/files/models/patch-file-metadata.model';
import { ResourceCustomMetadataResponse } from '@osf/features/files/models/resource-custom-metadata-response.model';

import { DEFAULT_TABLE_PARAMS } from '../constants/default-table-params.constants';
import { FileKind } from '../enums/file-kind.enum';
import { ResourceType } from '../enums/resource-type.enum';
import { AddonMapper } from '../mappers/addon.mapper';
import { ContributorsMapper } from '../mappers/contributors';
import { FilesMapper } from '../mappers/files/files.mapper';
import { AddonModel } from '../models/addons/addon.model';
import { ResourceReferenceResponseJsonApi } from '../models/addons/addon-reference-json-api.model';
import { ConfiguredAddonModel } from '../models/addons/configured-addon.model';
import { ConfiguredAddonDataListResponseJsonApi } from '../models/addons/configured-addon-json-api.model';
import { AddonGetItemResponseJsonApi } from '../models/addons/external-addon-json-api.model';
import { ListMetaJsonApi } from '../models/common/json-api/meta.model';
import { JsonApiResponse } from '../models/common/json-api/responses.model';
import { ContributorModel } from '../models/contributors/contributor.model';
import { ContributorsResponseJsonApi } from '../models/contributors/contributor-response-json-api.model';
import { FileDetailsModel, FileDetailsWithMeta, FileModel } from '../models/files/file.model';
import { FileFolderModel } from '../models/files/file-folder.model';
import {
  FileFolderDataJsonApi,
  FileFolderResponseJsonApi,
  FileFoldersResponseJsonApi,
} from '../models/files/file-folder-json-api.model';
import {
  FileDetailsDataJsonApi,
  FileDetailsResponseJsonApi,
  FileResponseJsonApi,
  FilesResponseJsonApi,
} from '../models/files/file-json-api.model';
import { FileVersionModel } from '../models/files/file-version.model';
import { FileVersionsResponseJsonApi } from '../models/files/file-version-json-api.model';
import { PaginatedData } from '../models/paginated-data.model';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  get addonsApiUrl() {
    return this.environment.addonsApiUrl;
  }

  private readonly filesFields = 'name,guid,kind,extra,size,path,materialized_path,date_modified,parent_folder,files';

  private readonly resourcePathMap: Record<number, string> = {
    [ResourceType.Project]: 'nodes',
    [ResourceType.Registration]: 'registrations',
    [ResourceType.Preprint]: 'preprints',
  };

  getFiles(
    filesLink: string,
    search: string,
    sort: string,
    page = 1
  ): Observable<{ files: FileModel[]; meta?: ListMetaJsonApi }> {
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

  getFolders(folderLink: string): Observable<PaginatedData<FileFolderModel[]>> {
    return this.jsonApiService.get<FileFoldersResponseJsonApi>(`${folderLink}`).pipe(
      map((response) => ({
        data: FilesMapper.getFileFolders(response.data),
        totalCount: response.meta.total,
        pageSize: response.meta.per_page ?? DEFAULT_TABLE_PARAMS.rows,
        isAnonymous: response.meta.anonymous ?? false,
      }))
    );
  }

  getRootFolders(resourceId: string, resourceType: ResourceType): Observable<PaginatedData<FileFolderModel[]>> {
    const resourcePath = this.resourcePathMap[resourceType];
    return this.getFolders(`${this.apiUrl}/${resourcePath}/${resourceId}/files/`);
  }

  getFilesWithoutFiltering(filesLink: string, page = 1): Observable<PaginatedData<FileModel[]>> {
    const params: Record<string, string> = { page: page.toString() };

    return this.jsonApiService.get<FilesResponseJsonApi>(filesLink, params).pipe(
      map((response) => ({
        data: FilesMapper.getFiles(response.data),
        totalCount: response.meta.total,
        pageSize: response.meta.per_page ?? DEFAULT_TABLE_PARAMS.rows,
      }))
    );
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

  getFileTarget(fileGuid: string): Observable<FileDetailsWithMeta> {
    return this.jsonApiService
      .get<FileDetailsResponseJsonApi>(`${this.apiUrl}/files/${fileGuid}/?embed=target`)
      .pipe(map((response) => ({ file: FilesMapper.getFileDetails(response.data), meta: response.meta })));
  }

  getFileGuid(id: string): Observable<FileModel> {
    const params = { create_guid: 'true' };

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
      .get<FileMetadataResponse>(`${this.apiUrl}/custom_file_metadata_records/${fileGuid}/`)
      .pipe(map((response) => MapFileCustomMetadata(response.data)));
  }

  getResourceShortInfo(resourceId: string, resourceType: string): Observable<NodeShortInfoResponse> {
    const params = {
      'fields[nodes]': 'title,description,date_created,date_modified,identifiers',
      embed: 'identifiers',
    };
    return this.jsonApiService.get<NodeShortInfoResponse>(`${this.apiUrl}/${resourceType}/${resourceId}/`, params);
  }

  getCustomMetadata(resourceId: string): Observable<ResourceCustomMetadataResponse> {
    return this.jsonApiService.get<ResourceCustomMetadataResponse>(
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
      .patch<FileCustomMetadataDataJsonApi>(`${this.apiUrl}/custom_file_metadata_records/${fileGuid}/`, payload)
      .pipe(map((response) => MapFileCustomMetadata(response)));
  }

  getFileRevisions(link: string): Observable<OsfFileRevision[]> {
    const separator = link.includes('?') ? '&' : '?';
    const urlWithRevisions = `${link}${separator}revisions=`;

    return this.jsonApiService
      .get<FileRevisionsResponse>(urlWithRevisions)
      .pipe(map((response) => MapFileRevision(response.data)));
  }

  updateTags(tags: string[], fileGuid: string): Observable<FileDetailsModel> {
    const payload = {
      data: {
        id: fileGuid,
        type: 'files',
        relationships: {},
        attributes: { tags: tags },
      },
    };

    return this.jsonApiService
      .patch<FileDetailsDataJsonApi>(`${this.apiUrl}/files/${fileGuid}/`, payload)
      .pipe(map((response) => FilesMapper.getFileDetails(response)));
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
    const params = { 'filter[resource_uri]': resourceUri };

    return this.jsonApiService
      .get<ResourceReferenceResponseJsonApi>(`${this.addonsApiUrl}/resource-references`, params)
      .pipe(map((response) => response.data?.[0]?.links?.self ?? ''));
  }

  getConfiguredStorageAddons(resourceId: string): Observable<ConfiguredAddonModel[]> {
    const resourceUri = `${this.environment.webUrl}/${resourceId}`;

    return this.getResourceReferences(resourceUri).pipe(
      switchMap((referenceUrl: string) => {
        if (!referenceUrl) return of([]);
        return this.jsonApiService
          .get<ConfiguredAddonDataListResponseJsonApi>(`${referenceUrl}/configured_storage_addons`)
          .pipe(map((response) => response.data.map((item) => AddonMapper.fromConfiguredAddonResponse(item))));
      })
    );
  }

  getExternalStorageService(serviceId: string): Observable<AddonModel> {
    return this.jsonApiService
      .get<AddonGetItemResponseJsonApi>(
        `${this.addonsApiUrl}/configured-storage-addons/${serviceId}/external_storage_service/`
      )
      .pipe(map((response) => AddonMapper.fromResponse(response.data)));
  }
}
