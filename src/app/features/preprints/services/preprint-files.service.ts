import { map, Observable, switchMap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services';
import { ApiData } from '@osf/core/models';
import { PreprintsMapper } from '@osf/features/preprints/mappers';
import {
  Preprint,
  PreprintAttributesJsonApi,
  PreprintFilesLinks,
  PreprintRelationshipsJsonApi,
} from '@osf/features/preprints/models';
import { GetFileResponse, GetFilesResponse, OsfFile } from '@osf/shared/models';
import { FilesService } from '@shared/services';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PreprintFilesService {
  private filesService = inject(FilesService);
  private jsonApiService = inject(JsonApiService);

  updateFileRelationship(preprintId: string, fileId: string): Observable<Preprint> {
    return this.jsonApiService
      .patch<ApiData<PreprintAttributesJsonApi, null, PreprintRelationshipsJsonApi, null>>(
        `${environment.apiUrl}/preprints/${preprintId}/`,
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
    return this.jsonApiService.get<GetFilesResponse>(`${environment.apiUrl}/preprints/${id}/files/`).pipe(
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

  getProjectFiles(projectId: string): Observable<OsfFile[]> {
    return this.jsonApiService.get<GetFilesResponse>(`${environment.apiUrl}/nodes/${projectId}/files/`).pipe(
      switchMap((response: GetFilesResponse) => {
        return this.jsonApiService
          .get<GetFileResponse>(response.data[0].relationships.root_folder.links.related.href)
          .pipe(
            switchMap((fileResponse) =>
              this.filesService.getFilesWithoutFiltering(fileResponse.data.relationships.files.links.related.href)
            )
          );
      })
    );
  }
}
