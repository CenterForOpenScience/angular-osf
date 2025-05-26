import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';

import { SparseCollectionsResponse } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  #jsonApiService = inject(JsonApiService);

  getBookmarksCollectionId(): Observable<string> {
    const params: Record<string, unknown> = {
      'fields[collections]': 'title,bookmarks',
    };

    return this.#jsonApiService.get<SparseCollectionsResponse>(environment.apiUrl + '/collections/', params).pipe(
      map((response: SparseCollectionsResponse) => {
        const bookmarksCollection = response.data.find(
          (collection) => collection.attributes.title === 'Bookmarks' && collection.attributes.bookmarks
        );
        return bookmarksCollection?.id ?? '';
      })
    );
  }

  addProjectToBookmarks(bookmarksId: string, projectId: string): Observable<void> {
    const url = `${environment.apiUrl}/collections/${bookmarksId}/relationships/linked_nodes/`;
    const payload = {
      data: [
        {
          type: 'linked_nodes',
          id: projectId,
        },
      ],
    };

    return this.#jsonApiService.post<void>(url, payload);
  }

  removeProjectFromBookmarks(bookmarksId: string, projectId: string): Observable<void> {
    const url = `${environment.apiUrl}/collections/${bookmarksId}/relationships/linked_nodes/`;
    const payload = {
      data: [
        {
          type: 'linked_nodes',
          id: projectId,
        },
      ],
    };

    return this.#jsonApiService.delete(url, payload);
  }
}
