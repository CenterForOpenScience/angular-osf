import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';
import { CollectionsMapper } from '@osf/features/collections/mappers';

import { CollectionProvider, CollectionProviderGetResponseJsonApi, SparseCollectionsResponseJsonApi } from '../models';

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

    return this.#jsonApiService
      .get<SparseCollectionsResponseJsonApi>(environment.apiUrl + '/collections/', params)
      .pipe(
        map((response: SparseCollectionsResponseJsonApi) => {
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

  getCollectionProvider(collectionName: string): Observable<CollectionProvider> {
    const url = `${environment.apiUrl}/providers/collections/${collectionName}/`;

    return this.#jsonApiService
      .get<CollectionProviderGetResponseJsonApi>(url)
      .pipe(map((response) => CollectionsMapper.fromGetCollectionProviderResponse(response.data)));
  }
}
