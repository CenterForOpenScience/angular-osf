import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { JsonApiResponse } from '@shared/models/common/json-api.model';
import {
  ComponentsWikiJsonApiResponse,
  ComponentWiki,
  HomeWikiJsonApiResponse,
  WikiGetResponse,
  WikiJsonApiResponseWithMeta,
  WikiModel,
  WikisWithMeta,
  WikiVersion,
  WikiVersionJsonApiResponse,
} from '@shared/models/wiki/wiki.model';

import { ResourceType } from '../enums/resource-type.enum';
import { WikiMapper } from '../mappers/wiki';

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
    const body = {
      data: {
        type: 'wikis',
        attributes: {
          name,
        },
      },
    };
    return this.jsonApiService
      .post<JsonApiResponse<WikiGetResponse, null>>(`${this.apiUrl}/nodes/${projectId}/wikis/`, body)
      .pipe(map((response) => WikiMapper.fromCreateWikiResponse(response.data)));
  }

  deleteWiki(wikiId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/wikis/${wikiId}/`);
  }

  getHomeWiki(resourceType: ResourceType, resourceId: string): Observable<string> {
    const baseUrl = this.getBaseUrl(resourceType, resourceId);
    const params: Record<string, unknown> = {
      'filter[name]': 'home',
    };

    return this.jsonApiService.get<HomeWikiJsonApiResponse>(baseUrl, params).pipe(
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

  getWikiList(resourceType: ResourceType, resourceId: string): Observable<WikisWithMeta> {
    const params: Record<string, unknown> = {
      'page[size]': 100,
    };

    const baseUrl = this.getBaseUrl(resourceType, resourceId);

    return this.jsonApiService.get<WikiJsonApiResponseWithMeta>(baseUrl, params).pipe(
      map((response) => ({
        wikis: response.data.map((wiki) => WikiMapper.fromGetWikiResponse(wiki)),
        meta: response.meta,
      }))
    );
  }

  getComponentsWikiList(resourceType: ResourceType, resourceId: string): Observable<ComponentWiki[]> {
    const resourcePath = this.urlMap.get(resourceType);
    const params: Record<string, unknown> = {
      embed: 'wikis',
      'page[size]': 100,
    };
    return this.jsonApiService
      .get<ComponentsWikiJsonApiResponse>(`${this.apiUrl}/${resourcePath}/${resourceId}/children/`, params)
      .pipe(map((response) => response.data.map((component) => WikiMapper.fromGetComponentsWikiResponse(component))));
  }

  getWikiVersions(wikiId: string): Observable<WikiVersion[]> {
    const params: Record<string, unknown> = {
      embed: 'user',
      'page[size]': 100,
      'fields[users]': 'full_name',
    };

    return this.jsonApiService
      .get<WikiVersionJsonApiResponse>(`${this.apiUrl}/wikis/${wikiId}/versions/`, params)
      .pipe(map((response) => response.data.map((version) => WikiMapper.fromGetWikiVersionResponse(version))));
  }

  createWikiVersion(wikiId: string, content: string): Observable<unknown> {
    const body = {
      data: {
        type: 'wiki-versions',
        attributes: {
          content,
        },
      },
    };

    return this.jsonApiService
      .post<JsonApiResponse<WikiGetResponse, null>>(`${this.apiUrl}/wikis/${wikiId}/versions/`, body)
      .pipe(map((response) => WikiMapper.fromCreateWikiResponse(response.data)));
  }

  getWikiVersionContent(wikiId: string, versionId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/wikis/${wikiId}/versions/${versionId}/content/`, { responseType: 'text' });
  }
}
