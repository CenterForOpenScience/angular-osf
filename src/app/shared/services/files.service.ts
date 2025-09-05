import { Observable, of, switchMap, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { MapFileCustomMetadata, MapFileRevision } from '@osf/features/files/mappers';
import {
  CreateFolderResponse,
  FileCustomMetadata,
  FileTargetResponse,
  GetCustomMetadataResponse,
  GetFileMetadataResponse,
  GetFileRevisionsResponse,
  GetFileTargetResponse,
  GetShortInfoResponse,
  OsfFileCustomMetadata,
  OsfFileRevision,
  PatchFileMetadata,
} from '@osf/features/files/models';
import {
  AddFileResponse,
  ApiData,
  ConfiguredAddonGetResponseJsonApi,
  ConfiguredStorageAddonModel,
  ContributorModel,
  ContributorResponse,
  FileLinks,
  FileRelationshipsResponse,
  FileResponse,
  FileVersionsResponseJsonApi,
  GetFileResponse,
  GetFilesResponse,
  GetFilesResponseWithMeta,
  JsonApiResponse,
  MetaAnonymousJsonApi,
  OsfFile,
  OsfFileVersion,
} from '@shared/models';
import { JsonApiService } from '@shared/services';
import { ToastService } from '@shared/services/toast.service';

import { ResourceType } from '../enums';
import { AddonMapper, ContributorsMapper, MapFile, MapFiles, MapFileVersions } from '../mappers';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  readonly jsonApiService = inject(JsonApiService);
  readonly toastService = inject(ToastService);
  filesFields = 'name,guid,kind,extra,size,path,materialized_path,date_modified,parent_folder,files';

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
  ]);

  getFiles(
    filesLink: string,
    search: string,
    sort: string
  ): Observable<{ files: OsfFile[]; meta?: MetaAnonymousJsonApi }> {
    const params: Record<string, string> = {
      sort: sort,
      'fields[files]': this.filesFields,
      'filter[name]': search,
    };

    return this.jsonApiService
      .get<GetFilesResponseWithMeta>(`${filesLink}`, params)
      .pipe(map((response) => ({ files: MapFiles(response.data), meta: response.meta })));
  }

  getFolders(folderLink: string): Observable<{ files: OsfFile[]; meta?: MetaAnonymousJsonApi }> {
    return this.jsonApiService
      .get<GetFilesResponseWithMeta>(`${folderLink}`)
      .pipe(map((response) => ({ files: MapFiles(response.data), meta: response.meta })));
  }

  getFilesWithoutFiltering(filesLink: string): Observable<OsfFile[]> {
    return this.jsonApiService.get<GetFilesResponse>(filesLink).pipe(map((response) => MapFiles(response.data)));
  }

  uploadFile(file: File, uploadLink: string): Observable<HttpEvent<JsonApiResponse<AddFileResponse, null>>> {
    const params = {
      kind: 'file',
      name: file.name,
    };

    return this.jsonApiService.putFile<AddFileResponse>(uploadLink, file, params).pipe(
      catchError((error) => {
        this.toastService.showError(error.error.message);
        return throwError(() => error);
      })
    );
  }

  updateFileContent(file: File, link: string) {
    const params = {
      kind: 'file',
    };

    return this.jsonApiService.put(link, file, params);
  }

  createFolder(link: string, folderName: string): Observable<OsfFile> {
    return this.jsonApiService.put<CreateFolderResponse>(link, null, { name: folderName }).pipe(
      map((response) => MapFile(response)),
      catchError((error) => {
        this.toastService.showError(error.error.message);
        return throwError(() => error);
      })
    );
  }

  getFolder(link: string): Observable<OsfFile> {
    return this.jsonApiService.get<GetFileResponse>(link).pipe(
      map((response) => MapFile(response.data)),
      catchError((error) => {
        this.toastService.showError(error.error.message);
        return throwError(() => error);
      })
    );
  }

  deleteEntry(link: string) {
    return this.jsonApiService.delete(link).pipe(
      catchError((error) => {
        this.toastService.showError(error.error.message);
        return throwError(() => error);
      })
    );
  }

  renameEntry(link: string, name: string, conflict = ''): Observable<OsfFile> {
    const body = {
      action: 'rename',
      rename: name,
      conflict,
    };
    return this.jsonApiService.post(link, body);
  }

  moveFile(link: string, path: string, resourceId: string, provider: string, action: string): Observable<OsfFile> {
    const body = {
      action: action,
      path: path,
      provider: provider,
      resource: resourceId,
    };

    return this.jsonApiService.post<GetFileResponse>(link, body).pipe(
      map((response) => MapFile(response.data)),
      catchError((error) => {
        this.toastService.showError(error.error.message);
        return throwError(() => error);
      })
    );
  }

  getFolderDownloadLink(resourceId: string, provider: string, folderId: string, isRootFolder: boolean): string {
    if (isRootFolder) {
      return `${environment.fileApiUrl}/resources/${resourceId}/providers/${provider}/?zip=`;
    }
    return `${environment.fileApiUrl}/resources/${resourceId}/providers/${provider}/${folderId}/?zip=`;
  }

  getFileTarget(fileGuid: string): Observable<OsfFile> {
    return this.jsonApiService
      .get<GetFileTargetResponse>(`${environment.apiUrl}/files/${fileGuid}/?embed=target`)
      .pipe(map((response) => MapFile(response.data)));
  }

  getFileGuid(id: string): Observable<OsfFile> {
    const params = {
      create_guid: 'true',
    };

    return this.jsonApiService
      .get<GetFileResponse>(`${environment.apiUrl}/files/${id}/`, params)
      .pipe(map((response) => MapFile(response.data)));
  }

  getFileById(fileGuid: string): Observable<OsfFile> {
    return this.jsonApiService
      .get<GetFileResponse>(`${environment.apiUrl}/files/${fileGuid}/`)
      .pipe(map((response) => MapFile(response.data)));
  }

  getFileVersions(fileGuid: string): Observable<OsfFileVersion[]> {
    const params = {
      sort: '-id',
      'page[size]': 50,
    };

    return this.jsonApiService
      .get<FileVersionsResponseJsonApi>(`${environment.apiUrl}/files/${fileGuid}/versions/`, params)
      .pipe(map((response) => MapFileVersions(response)));
  }

  getFileMetadata(fileGuid: string): Observable<OsfFileCustomMetadata> {
    return this.jsonApiService
      .get<GetFileMetadataResponse>(`${environment.apiUrl}/custom_file_metadata_records/${fileGuid}/`)
      .pipe(map((response) => MapFileCustomMetadata(response.data)));
  }

  getResourceShortInfo(resourceId: string, resourceType: string): Observable<GetShortInfoResponse> {
    const params = {
      'fields[nodes]': 'title,description,date_created,date_modified,identifiers',
      embed: 'identifiers',
    };
    return this.jsonApiService.get<GetShortInfoResponse>(
      `${environment.apiUrl}/${resourceType}/${resourceId}/`,
      params
    );
  }

  getCustomMetadata(resourceId: string): Observable<GetCustomMetadataResponse> {
    return this.jsonApiService.get<GetCustomMetadataResponse>(
      `${environment.apiUrl}/guids/${resourceId}/?embed=custom_metadata&resolve=false`
    );
  }

  getResourceContributors(resourceId: string, resourceType: string): Observable<Partial<ContributorModel>[]> {
    return this.jsonApiService
      .get<
        JsonApiResponse<ContributorResponse[], null>
      >(`${environment.apiUrl}/${resourceType}/${resourceId}/bibliographic_contributors/`)
      .pipe(map((response) => ContributorsMapper.fromResponse(response.data)));
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
      >(`${environment.apiUrl}/custom_file_metadata_records/${fileGuid}/`, payload)
      .pipe(map((response) => MapFileCustomMetadata(response)));
  }

  getFileRevisions(resourceId: string, provider: string, fileId: string): Observable<OsfFileRevision[]> {
    return this.jsonApiService
      .get<GetFileRevisionsResponse>(
        `${environment.fileApiUrl}/resources/${resourceId}/providers/${provider}/${fileId}?revisions=`
      )
      .pipe(map((response) => MapFileRevision(response.data)));
  }

  updateTags(tags: string[], fileGuid: string): Observable<OsfFile> {
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
      .patch<
        ApiData<FileResponse, FileTargetResponse, FileRelationshipsResponse, FileLinks>
      >(`${environment.apiUrl}/files/${fileGuid}/`, payload)
      .pipe(map((response) => MapFile(response)));
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
      .post<
        JsonApiResponse<ApiData<FileResponse, FileTargetResponse, FileRelationshipsResponse, FileLinks>, null>
      >(moveLink, body)
      .pipe(map((response) => MapFile(response.data)));
  }

  getResourceReferences(resourceUri: string): Observable<string> {
    const params = {
      'filter[resource_uri]': resourceUri,
    };

    return this.jsonApiService
      .get<
        JsonApiResponse<ApiData<null, null, null, { self: string }>[], null>
      >(`${environment.addonsV1Url}/resource-references`, params)
      .pipe(map((response) => response.data?.[0]?.links?.self ?? ''));
  }

  getConfiguredStorageAddons(resourceUri: string): Observable<ConfiguredStorageAddonModel[]> {
    return this.getResourceReferences(resourceUri).pipe(
      switchMap((referenceUrl: string) => {
        if (!referenceUrl) return of([]);

        return this.jsonApiService
          .get<JsonApiResponse<ConfiguredAddonGetResponseJsonApi[], null>>(`${referenceUrl}/configured_storage_addons`)
          .pipe(map((response) => response.data.map((item) => AddonMapper.fromConfiguredAddonResponse(item))));
      })
    );
  }
}
