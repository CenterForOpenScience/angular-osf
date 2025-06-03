import { select } from '@ngxs/store';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ApiData, JsonApiResponse } from '@core/models';
import { JsonApiService } from '@core/services';
import {
  AddFileResponse,
  CreateFolderResponse,
  FileCustomMetadata,
  GetFileMetadataResponse,
  GetFileResponse,
  GetFilesResponse,
  GetFileTargetResponse,
  GetProjectContributorsResponse,
  GetProjectCustomMetadataResponse,
  GetProjectShortInfoResponse,
  OsfFile,
  OsfFileCustomMetadata,
  OsfFileProjectContributor,
  PatchFileMetadata,
} from '@osf/features/project/files/models';
import { ProjectFilesSelectors } from '@osf/features/project/files/store';

import { MapFile, MapFileCustomMetadata, MapFiles } from '../mappers';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectFilesService {
  #jsonApiService = inject(JsonApiService);
  provider = select(ProjectFilesSelectors.getProvider);
  filesFields = 'name,guid,kind,extra,size,path,materialized_path,date_modified,parent_folder,files';

  getRootFolderFiles(projectId: string, search: string, sort: string): Observable<OsfFile[]> {
    const params: Record<string, string> = {
      sort: sort,
      'fields[files]': this.filesFields,
      'filter[name]': search,
    };

    return this.#jsonApiService
      .get<GetFilesResponse>(`${environment.apiUrl}/nodes/${projectId}/files/${this.provider()}/`, params)
      .pipe(map((response) => MapFiles(response.data)));
  }

  getFiles(filesLink: string, search: string, sort: string): Observable<OsfFile[]> {
    const params: Record<string, string> = {
      sort: sort,
      'fields[files]': this.filesFields,
      'filter[name]': search,
    };

    return this.#jsonApiService
      .get<GetFilesResponse>(`${filesLink}`, params)
      .pipe(map((response) => MapFiles(response.data)));
  }

  uploadFile(
    file: File,
    projectId: string,
    parentFolder?: OsfFile
  ): Observable<HttpEvent<JsonApiResponse<AddFileResponse, null>>> {
    const params = {
      kind: 'file',
      name: file.name,
    };

    let link = '';

    if (parentFolder?.relationships.parentFolderLink) {
      link = `${environment.fileApiUrl}/resources/${projectId}/providers/${this.provider()}/${parentFolder?.id ? parentFolder?.id + '/' : ''}`;
    } else {
      link = `${environment.fileApiUrl}/resources/${projectId}/providers/${this.provider()}/`;
    }

    return this.#jsonApiService.putFile<AddFileResponse>(link, file, params);
  }

  createFolder(projectId: string, folderName: string, parentFolderId?: string): Observable<OsfFile> {
    const params: Record<string, string> = {
      kind: 'folder',
      name: folderName,
    };

    const link = `${environment.fileApiUrl}/resources/${projectId}/providers/${this.provider()}/${parentFolderId ? parentFolderId + '/' : ''}`;

    return this.#jsonApiService
      .put<CreateFolderResponse>(link, null, params)
      .pipe(map((response) => MapFile(response)));
  }

  getFolder(link: string): Observable<OsfFile> {
    return this.#jsonApiService
      .get<JsonApiResponse<GetFileResponse, null>>(link)
      .pipe(map((response) => MapFile(response.data)));
  }

  deleteEntry(link: string) {
    return this.#jsonApiService.delete(link);
  }

  renameEntry(link: string, name: string) {
    const body = {
      action: 'rename',
      rename: name,
      conflict: '',
    };
    return this.#jsonApiService.post(link, body);
  }

  moveFile(link: string, path: string, projectId: string, action: string): Observable<OsfFile> {
    const body = {
      action: action,
      path: path,
      provider: this.provider(),
      resource: projectId,
    };

    return this.#jsonApiService.post<GetFileResponse>(link, body).pipe(map((response) => MapFile(response)));
  }

  getFolderDownloadLink(projectId: string, folderId: string, isRootFolder: boolean): string {
    if (isRootFolder) {
      return `${environment.fileApiUrl}/resources/${projectId}/providers/${this.provider()}/?zip=`;
    }
    return `${environment.fileApiUrl}/resources/${projectId}/providers/${this.provider()}/${folderId}/?zip=`;
  }

  getFileTarget(fileGuid: string): Observable<OsfFile> {
    return this.#jsonApiService
      .get<GetFileTargetResponse>(`${environment.apiUrl}/files/${fileGuid}/?embed=target`)
      .pipe(map((response) => MapFile(response.data)));
  }

  getFileMetadata(fileGuid: string): Observable<OsfFileCustomMetadata> {
    return this.#jsonApiService
      .get<GetFileMetadataResponse>(`${environment.apiUrl}/custom_file_metadata_records/${fileGuid}/`)
      .pipe(map((response) => MapFileCustomMetadata(response.data)));
  }

  getProjectShortInfo(projectId: string): Observable<GetProjectShortInfoResponse> {
    const params = {
      'field[nodes]': 'title,description,date_created,date_mofified',
      embed: 'bibliographic_contributors',
    };
    return this.#jsonApiService.get<GetProjectShortInfoResponse>(`${environment.apiUrl}/nodes/${projectId}/`, params);
  }

  getProjectCustomMetadata(projectId: string): Observable<GetProjectCustomMetadataResponse> {
    return this.#jsonApiService.get<GetProjectCustomMetadataResponse>(
      `${environment.apiUrl}/guids/${projectId}/?embed=custom_metadata&resolve=false`
    );
  }

  getProjectContributors(projectId: string): Observable<OsfFileProjectContributor[]> {
    const params = {
      'page[size]': '50',
      'fields[users]': 'full_name,active',
    };

    return this.#jsonApiService
      .get<GetProjectContributorsResponse>(
        `${environment.apiUrl}/nodes/${projectId}/contributors_and_group_members/`,
        params
      )
      .pipe(
        map((response) =>
          response.data.map((user) => ({
            id: user.id,
            name: user.attributes.full_name,
            active: user.attributes.active,
          }))
        )
      );
  }

  patchFileMetadata(data: PatchFileMetadata, fileGuid: string): Observable<OsfFileCustomMetadata> {
    const payload = {
      data: {
        id: fileGuid,
        type: 'custom_file_metadata_records',
        attributes: data,
      },
    };
    return this.#jsonApiService
      .patch<
        ApiData<FileCustomMetadata, null, null, null>
      >(`${environment.apiUrl}/custom_file_metadata_records/${fileGuid}/`, payload)
      .pipe(map((response) => MapFileCustomMetadata(response)));
  }

  getCitationDownloadLink(fileGuid: string): string {
    return `${environment.apiUrl}/custom_file_metadata_records/${fileGuid}/`;
  }
}
