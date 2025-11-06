import { finalize, map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { CurrentResourceType, ResourceType } from '../enums/resource-type.enum';
import { BaseNodeMapper } from '../mappers/nodes';
import { ResponseDataJsonApi, ResponseJsonApi } from '../models/common/json-api.model';
import { CurrentResource } from '../models/current-resource.model';
import { GuidedResponseJsonApi } from '../models/guid-response-json-api.model';
import { BaseNodeModel } from '../models/nodes/base-node.model';
import { BaseNodeDataJsonApi } from '../models/nodes/base-node-data-json-api.model';
import { NodeShortInfoModel } from '../models/nodes/node-with-children.model';

import { JsonApiService } from './json-api.service';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class ResourceGuidService {
  private jsonApiService = inject(JsonApiService);
  private loaderService = inject(LoaderService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
  ]);

  getResourceById(id: string): Observable<CurrentResource> {
    const baseUrl = `${this.apiUrl}/guids/${id}/`;

    this.loaderService.show();

    return this.jsonApiService.get<GuidedResponseJsonApi>(baseUrl).pipe(
      map(
        (res) =>
          ({
            id: res.data.type === CurrentResourceType.Files ? res.data.attributes.guid : res.data.id,
            type: res.data.type,
            parentId:
              res.data.type === CurrentResourceType.Preprints
                ? res.data.relationships.provider?.data.id
                : res.data.relationships.target?.data.id,
            parentType:
              res.data.type === CurrentResourceType.Preprints
                ? res.data.relationships.provider?.data.type
                : res.data.relationships.target?.data.type,
            wikiEnabled: res.data.attributes.wiki_enabled,
            permissions: res.data.attributes.current_user_permissions,
            rootResourceId: res.data.relationships.root?.data?.id,
          }) as CurrentResource
      ),
      finalize(() => this.loaderService.hide())
    );
  }

  getResourceDetails(resourceId: string, resourceType: ResourceType): Observable<BaseNodeModel> {
    const resourcePath = this.urlMap.get(resourceType);
    const params: Record<string, unknown> = {
      embed: 'parent',
    };
    return this.jsonApiService
      .get<ResponseDataJsonApi<BaseNodeDataJsonApi>>(`${this.apiUrl}/${resourcePath}/${resourceId}/`, params)
      .pipe(map((response) => BaseNodeMapper.getNodeData(response.data)));
  }

  getResourceWithChildren(
    rootParentId: string,
    resourceId: string,
    resourceType: ResourceType
  ): Observable<NodeShortInfoModel[]> {
    const resourcePath = this.urlMap.get(resourceType);

    return this.jsonApiService
      .get<
        ResponseJsonApi<BaseNodeDataJsonApi[]>
      >(`${this.apiUrl}/${resourcePath}/?filter[root]=${rootParentId}&page[size]=100`)
      .pipe(map((response) => BaseNodeMapper.getNodesWithChildren(response.data, resourceId)));
  }
}
