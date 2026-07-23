import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { ResourceType } from '../enums/resource-type.enum';
import { WikiMapper } from '../mappers/wiki';
import { NodesResponseJsonApi } from '../models/nodes/nodes-json-api.model';
import { PaginatedData } from '../models/paginated-data.model';
import { WikiModel, WikiVersion } from '../models/wiki/wiki.model';
import {
  WikiDataJsonApi,
  WikiItemResponseJsonApi,
  WikiResponseJsonApi,
  WikiVersionItemResponseJsonApi,
  WikiVersionResponseJsonApi,
} from '../models/wiki/wiki-json-api.model';
import { ComponentWiki } from '../stores/wiki';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class WikiService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly http = inject(HttpClient);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
  ]);

  private getBaseUrl(resourceType: ResourceType, resourceId: string): string {
    const resourcePath = this.urlMap.get(resourceType);

    if (!resourcePath) {
      throw new Error(`Unsupported resource type: ${resourceType}`);
    }

    return `${this.apiUrl}/${resourcePath}/${resourceId}/wikis/`;
  }

  createWiki(projectId: string, name: string): Observable<WikiModel> {
    const body = { data: { type: 'wikis', attributes: { name } } };

    return this.jsonApiService
      .post<WikiItemResponseJsonApi>(`${this.apiUrl}/nodes/${projectId}/wikis/`, body)
      .pipe(map((response) => WikiMapper.fromGetWikiResponse(response.data)));
  }

  renameWiki(id: string, name: string): Observable<WikiModel> {
    const body = { data: { type: 'wikis', attributes: { id, name } } };

    return this.jsonApiService
      .patch<WikiDataJsonApi>(`${this.apiUrl}/wikis/${id}/`, body)
      .pipe(map((response) => WikiMapper.fromGetWikiResponse(response)));
  }

  deleteWiki(wikiId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/wikis/${wikiId}/`);
  }

  getHomeWiki(resourceType: ResourceType, resourceId: string): Observable<string> {
    const baseUrl = this.getBaseUrl(resourceType, resourceId);
    const params: Record<string, unknown> = { 'filter[name]': 'home' };

    return this.jsonApiService.get<WikiResponseJsonApi>(baseUrl, params).pipe(
      map((response) => {
        const homeWiki = response.data.find((wiki) => wiki.attributes.name.toLocaleLowerCase() === 'home');
        if (!homeWiki) {
          return '';
        }
        const wiki = WikiMapper.fromGetHomeWikiResponse(homeWiki);
        return wiki.downloadLink;
      }),
      switchMap((downloadLink) => {
        if (!downloadLink) {
          return of('');
        }
        return this.http.get(downloadLink, { responseType: 'text' });
      })
    );
  }

  getWikiList(resourceType: ResourceType, resourceId: string): Observable<PaginatedData<WikiModel[]>> {
    const params: Record<string, unknown> = {
      'page[size]': 100,
    };

    const baseUrl = this.getBaseUrl(resourceType, resourceId);

    return this.jsonApiService.get<WikiResponseJsonApi>(baseUrl, params).pipe(
      map((response) => ({
        data: response.data.map((wiki) => WikiMapper.fromGetWikiResponse(wiki)),
        totalCount: response.meta.total,
        pageSize: response.meta.per_page ?? 100,
        isAnonymous: response.meta.anonymous ?? false,
      }))
    );
  }

  getComponentsWikiList(resourceType: ResourceType, resourceId: string): Observable<ComponentWiki[]> {
    const resourcePath = this.urlMap.get(resourceType);
    const params: Record<string, unknown> = { embed: 'wikis', 'page[size]': 100 };

    return this.jsonApiService
      .get<NodesResponseJsonApi>(`${this.apiUrl}/${resourcePath}/${resourceId}/children/`, params)
      .pipe(map((response) => response.data.map((component) => WikiMapper.fromGetComponentsWikiResponse(component))));
  }

  getWikiVersions(wikiId: string): Observable<WikiVersion[]> {
    const params: Record<string, unknown> = {
      embed: 'user',
      'page[size]': 100,
      'fields[users]': 'full_name',
    };

    return this.jsonApiService
      .get<WikiVersionResponseJsonApi>(`${this.apiUrl}/wikis/${wikiId}/versions/`, params)
      .pipe(map((response) => response.data.map((version) => WikiMapper.fromGetWikiVersionResponse(version))));
  }

  createWikiVersion(wikiId: string, content: string): Observable<unknown> {
    const body = { data: { type: 'wiki-versions', attributes: { content } } };

    return this.jsonApiService
      .post<WikiVersionItemResponseJsonApi>(`${this.apiUrl}/wikis/${wikiId}/versions/`, body)
      .pipe(map((response) => WikiMapper.fromGetWikiVersionResponse(response.data)));
  }

  getWikiVersionContent(wikiId: string, versionId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/wikis/${wikiId}/versions/${versionId}/content/`, { responseType: 'text' });
  }
}
