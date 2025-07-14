import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services';
import { SparseCollectionsResponseJsonApi } from '@osf/features/collections/models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookmarksService {
  private jsonApiService = inject(JsonApiService);

  getBookmarksCollectionId(): Observable<string> {
    const params: Record<string, unknown> = {
      'fields[collections]': 'title,bookmarks',
    };

    return this.jsonApiService.get<SparseCollectionsResponseJsonApi>(environment.apiUrl + '/collections/', params).pipe(
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

    return this.jsonApiService.post<void>(url, payload);
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

    return this.jsonApiService.delete(url, payload);
  }

  addRegistrationToBookmarks(bookmarksId: string, registryId: string): Observable<void> {
    const url = `${environment.apiUrl}/collections/${bookmarksId}/relationships/linked_registrations/`;
    const payload = {
      data: [
        {
          type: 'linked_registrations',
          id: registryId,
        },
      ],
    };

    return this.jsonApiService.post<void>(url, payload);
  }

  removeRegistrationFromBookmarks(bookmarksId: string, registryId: string): Observable<void> {
    const url = `${environment.apiUrl}/collections/${bookmarksId}/relationships/linked_registrations/`;
    const payload = {
      data: [
        {
          type: 'linked_registrations',
          id: registryId,
        },
      ],
    };

    return this.jsonApiService.delete(url, payload);
  }
}
