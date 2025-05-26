import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';

import { WikiMapper } from '../mappers';
import { HomeWikiJsonApiResponse } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WikiService {
  readonly #jsonApiService = inject(JsonApiService);
  readonly #http = inject(HttpClient);

  getHomeWiki(projectId: string): Observable<string> {
    const params: Record<string, unknown> = {
      'filter[name]': 'home',
    };
    return this.#jsonApiService
      .get<HomeWikiJsonApiResponse>(environment.apiUrl + `/nodes/${projectId}/wikis/`, params)
      .pipe(
        map((response) => {
          const homeWiki = response.data.find((wiki) => wiki.attributes.name === 'home');
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
}
