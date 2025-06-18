import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';

import { WikiMapper } from '../mappers';
import {
  ComponentsWikiJsonApiResponse,
  HomeWikiJsonApiResponse,
  Wiki,
  WikiGetResponse,
  WikiJsonApiResponse,
  WikiVersion,
  WikiVersionJsonApiResponse,
} from '../models';
import { ComponentWiki } from '../store';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WikiService {
  readonly #jsonApiService = inject(JsonApiService);
  readonly #http = inject(HttpClient);

  createWiki(projectId: string, name: string): Observable<Wiki> {
    const body = {
      data: {
        type: 'wikis',
        attributes: {
          name,
        },
      },
    };
    return this.#jsonApiService.post<WikiGetResponse>(environment.apiUrl + `/nodes/${projectId}/wikis/`, body).pipe(
      map((response) => {
        return WikiMapper.fromCreateWikiResponse(response);
      })
    );
  }

  deleteWiki(wikiId: string): Observable<void> {
    return this.#jsonApiService.delete(environment.apiUrl + `/wikis/${wikiId}/`);
  }

  getHomeWiki(projectId: string): Observable<string> {
    const params: Record<string, unknown> = {
      'filter[name]': 'home',
    };
    return this.#jsonApiService
      .get<HomeWikiJsonApiResponse>(environment.apiUrl + `/nodes/${projectId}/wikis/`, params)
      .pipe(
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
          return this.#http.get(downloadLink, { responseType: 'text' });
        }),
        map((content) => (content ? content.replace(/\n/g, '<br>') : ''))
      );
  }

  getWikiList(projectId: string): Observable<Wiki[]> {
    return this.#jsonApiService
      .get<WikiJsonApiResponse>(environment.apiUrl + `/nodes/${projectId}/wikis/`)
      .pipe(map((response) => response.data.map((wiki) => WikiMapper.fromGetWikiResponse(wiki))));
  }

  getComponentsWikiList(projectId: string): Observable<ComponentWiki[]> {
    return this.#jsonApiService
      .get<ComponentsWikiJsonApiResponse>(environment.apiUrl + `/nodes/${projectId}/children/?embed=wikis`)
      .pipe(map((response) => response.data.map((component) => WikiMapper.fromGetComponentsWikiResponse(component))));
  }

  getWikiVersions(wikiId: string): Observable<WikiVersion[]> {
    const params: Record<string, unknown> = {
      embed: 'user',
      'fields[users]': 'full_name',
    };
    return this.#jsonApiService
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
    return this.#jsonApiService.post<WikiGetResponse>(environment.apiUrl + `/wikis/${wikiId}/versions/`, body).pipe(
      map((response) => {
        return WikiMapper.fromCreateWikiResponse(response);
      })
    );
  }

  getWikiVersionContent(wikiId: string, versionId: string): Observable<string> {
    return this.#http.get(environment.apiUrl + `/wikis/${wikiId}/versions/${versionId}/content/`, {
      responseType: 'text',
    });
  }
}
