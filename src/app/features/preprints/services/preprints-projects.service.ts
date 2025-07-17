import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { Primitive, StringOrNull } from '@core/helpers';
import { JsonApiService } from '@core/services';
import { ApiData, JsonApiResponse } from '@osf/core/models';
import { PreprintsMapper } from '@osf/features/preprints/mappers';
import { Preprint, PreprintAttributesJsonApi, PreprintRelationshipsJsonApi } from '@osf/features/preprints/models';
import { CreateProjectPayloadJsoApi, IdName, NodeData } from '@osf/shared/models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PreprintsProjectsService {
  private jsonApiService = inject(JsonApiService);

  getAvailableProjects(searchTerm: StringOrNull): Observable<IdName[]> {
    const params: Record<string, Primitive> = {};
    params['page'] = 1;
    if (searchTerm) {
      params['filter[title]'] = searchTerm;
    }

    return this.jsonApiService
      .get<JsonApiResponse<NodeData[], null>>(`${environment.apiUrl}/users/me/nodes/`, params)
      .pipe(
        map((response) => {
          return response.data.map((item) => ({
            id: item.id,
            name: item.attributes.title,
          }));
        })
      );
  }

  getProjectById(projectId: string): Observable<IdName> {
    return this.jsonApiService.get<JsonApiResponse<NodeData, null>>(`${environment.apiUrl}/nodes/${projectId}/`).pipe(
      map((response) => {
        return {
          id: response.data.id,
          name: response.data.attributes.title,
        };
      })
    );
  }

  removePreprintProjectRelationship(preprintId: string) {
    return this.jsonApiService.patch(`${environment.apiUrl}/preprints/${preprintId}/relationships/node/`, {
      data: [],
    });
  }

  updatePreprintProjectRelationship(preprintId: string, projectId: string): Observable<Preprint> {
    return this.jsonApiService
      .patch<ApiData<PreprintAttributesJsonApi, null, PreprintRelationshipsJsonApi, null>>(
        `${environment.apiUrl}/preprints/${preprintId}/`,
        {
          data: {
            type: 'preprints',
            id: preprintId,
            attributes: {},
            relationships: {
              node: {
                data: {
                  type: 'nodes',
                  id: projectId,
                },
              },
            },
          },
        }
      )
      .pipe(map((response) => PreprintsMapper.fromPreprintJsonApi(response)));
  }

  createProject(
    title: string,
    description: string,
    templateFrom: string,
    regionId: string,
    affiliationsId: string[]
  ): Observable<IdName> {
    const payload: CreateProjectPayloadJsoApi = {
      data: {
        type: 'nodes',
        attributes: {
          title,
          ...(description && { description }),
          category: 'project',
          ...(templateFrom && { template_from: templateFrom }),
        },
        relationships: {
          region: {
            data: {
              type: 'regions',
              id: regionId,
            },
          },
          ...(affiliationsId.length > 0 && {
            affiliated_institutions: {
              data: affiliationsId.map((id) => ({
                type: 'institutions',
                id,
              })),
            },
          }),
        },
      },
    };

    return this.jsonApiService.post<JsonApiResponse<NodeData, null>>(`${environment.apiUrl}/nodes/`, payload).pipe(
      map((response) => {
        return {
          id: response.data.id,
          name: response.data.attributes.title,
        };
      })
    );
  }
}
