import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { Primitive, StringOrNull } from '@osf/shared/helpers';
import { ApiData, CreateProjectPayloadJsoApi, IdName, JsonApiResponse, NodeData } from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

import { PreprintsMapper } from '../mappers';
import { Preprint, PreprintAttributesJsonApi, PreprintLinksJsonApi, PreprintRelationshipsJsonApi } from '../models';

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
      .patch<ApiData<PreprintAttributesJsonApi, null, PreprintRelationshipsJsonApi, PreprintLinksJsonApi>>(
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
