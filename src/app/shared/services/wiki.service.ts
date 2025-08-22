import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/shared/services';
import { JsonApiResponse } from '@shared/models';

import { ResourceType } from '../enums';
import { WikiMapper } from '../mappers/wiki';
import {
  ComponentsWikiJsonApiResponse,
  ComponentWiki,
  HomeWikiJsonApiResponse,
  Wiki,
  WikiGetResponse,
  WikiJsonApiResponse,
  WikiVersion,
  WikiVersionJsonApiResponse,
} from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WikiService {
  private readonly jsonApiService = inject(JsonApiService);
  readonly http = inject(HttpClient);

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
  ]);

  private getBaseUrl(resourceType: ResourceType, resourceId: string): string {
    const baseUrl = `${environment.apiUrl}`;
    const resourcePath = this.urlMap.get(resourceType);

    if (!resourcePath) {
      throw new Error(`Unsupported resource type: ${resourceType}`);
    }

    return `${baseUrl}/${resourcePath}/${resourceId}/wikis/`;
  }

  createWiki(projectId: string, name: string): Observable<Wiki> {
    const body = {
      data: {
        type: 'wikis',
        attributes: {
          name,
        },
      },
    };
    return this.jsonApiService
      .post<JsonApiResponse<WikiGetResponse, null>>(environment.apiUrl + `/nodes/${projectId}/wikis/`, body)
      .pipe(
        map((response) => {
          return WikiMapper.fromCreateWikiResponse(response.data);
        })
      );
  }

  deleteWiki(wikiId: string): Observable<void> {
    return this.jsonApiService.delete(environment.apiUrl + `/wikis/${wikiId}/`);
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

  getWikiList(resourceType: ResourceType, resourceId: string): Observable<Wiki[]> {
    const baseUrl = this.getBaseUrl(resourceType, resourceId);
    return this.jsonApiService
      .get<WikiJsonApiResponse>(baseUrl)
      .pipe(map((response) => response.data.map((wiki) => WikiMapper.fromGetWikiResponse(wiki))));
  }

  getComponentsWikiList(resourceType: ResourceType, resourceId: string): Observable<ComponentWiki[]> {
    const resourcePath = this.urlMap.get(resourceType);
    return this.jsonApiService
      .get<ComponentsWikiJsonApiResponse>(environment.apiUrl + `/${resourcePath}/${resourceId}/children/?embed=wikis`)
      .pipe(map((response) => response.data.map((component) => WikiMapper.fromGetComponentsWikiResponse(component))));
  }

  getWikiVersions(wikiId: string): Observable<WikiVersion[]> {
    const params: Record<string, unknown> = {
      embed: 'user',
      'fields[users]': 'full_name',
    };
    return this.jsonApiService
      .get<WikiVersionJsonApiResponse>(environment.apiUrl + `/wikis/${wikiId}/versions/`, params)
      .pipe(
        map((response) => {
          return response.data.map((version) => WikiMapper.fromGetWikiVersionResponse(version));
        })
      );
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
      .post<JsonApiResponse<WikiGetResponse, null>>(environment.apiUrl + `/wikis/${wikiId}/versions/`, body)
      .pipe(
        map((response) => {
          return WikiMapper.fromCreateWikiResponse(response.data);
        })
      );
  }

  getWikiVersionContent(wikiId: string, versionId: string): Observable<string> {
    return this.http.get(environment.apiUrl + `/wikis/${wikiId}/versions/${versionId}/content/`, {
      responseType: 'text',
    });
  }
}
