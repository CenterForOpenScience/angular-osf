/* eslint-disable @typescript-eslint/no-explicit-any */
import { map, Observable, switchMap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { PreprintsMapper } from '@osf/features/preprints/mappers';
import {
  PreprintAttributesJsonApi,
  PreprintFilesLinks,
  PreprintLinksJsonApi,
  PreprintModel,
  PreprintRelationshipsJsonApi,
} from '@osf/features/preprints/models';
import { ApiData } from '@osf/shared/models/common/json-api.model';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import {
  FileFolderResponseJsonApi,
  FileFoldersResponseJsonApi,
} from '@osf/shared/models/files/file-folder-json-api.model';
import { FilesService } from '@osf/shared/services/files.service';
import { JsonApiService } from '@osf/shared/services/json-api.service';
import { FilesMapper } from '@shared/mappers/files/files.mapper';

@Injectable({
  providedIn: 'root',
})
export class PreprintFilesService {
  private filesService = inject(FilesService);
  private jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  updateFileRelationship(preprintId: string, fileId: string): Observable<PreprintModel> {
    return this.jsonApiService
      .patch<ApiData<PreprintAttributesJsonApi, null, PreprintRelationshipsJsonApi, PreprintLinksJsonApi>>(
        `${this.apiUrl}/preprints/${preprintId}/`,
        {
          data: {
            type: 'preprints',
            id: preprintId,
            attributes: {},
            relationships: {
              primary_file: {
                data: {
                  type: 'files',
                  id: fileId,
                },
              },
            },
          },
        }
      )
      .pipe(map((response) => PreprintsMapper.fromPreprintJsonApi(response)));
  }

  getPreprintFilesLinks(id: string): Observable<PreprintFilesLinks> {
    return this.jsonApiService.get<any>(`${this.apiUrl}/preprints/${id}/files/`).pipe(
      map((response) => {
        const rel = response.data[0].relationships;
        const links = response.data[0].links;

        return {
          filesLink: rel.files.links.related.href,
          uploadFileLink: links.upload,
        };
      })
    );
  }

  getProjectRootFolder(projectId: string): Observable<FileFolderModel> {
    return this.jsonApiService.get<any>(`${this.apiUrl}/nodes/${projectId}/files/`).pipe(
      switchMap((response: FileFoldersResponseJsonApi) => {
        return this.jsonApiService
          .get<FileFolderResponseJsonApi>(response.data[0].relationships.root_folder.links.related.href)
          .pipe(map((folder) => FilesMapper.getFileFolder(folder.data)));
      })
    );
  }
}
