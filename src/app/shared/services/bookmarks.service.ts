import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { ResourceType } from '../enums/resource-type.enum';
import { SparseCollectionsResponseJsonApi } from '../models/collections/collections-json-api.models';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class BookmarksService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'linked_nodes'],
    [ResourceType.Registration, 'linked_registrations'],
  ]);

  private readonly resourceMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
  ]);

  getBookmarksCollectionId(): Observable<string> {
    const params: Record<string, unknown> = {
      'fields[collections]': 'title,bookmarks',
    };

    return this.jsonApiService.get<SparseCollectionsResponseJsonApi>(`${this.apiUrl}/collections/`, params).pipe(
      map((response: SparseCollectionsResponseJsonApi) => {
        const bookmarksCollection = response.data.find(
          (collection) => collection.attributes.title === 'Bookmarks' && collection.attributes.bookmarks
        );
        return bookmarksCollection?.id ?? '';
      })
    );
  }

  addResourceToBookmarks(bookmarksId: string, resourceId: string, resourceType: ResourceType): Observable<void> {
    const url = `${this.apiUrl}/collections/${bookmarksId}/relationships/${this.urlMap.get(resourceType)}/`;
    const payload = { data: [{ type: this.resourceMap.get(resourceType), id: resourceId }] };

    return this.jsonApiService.post<void>(url, payload);
  }

  removeResourceFromBookmarks(bookmarksId: string, resourceId: string, resourceType: ResourceType): Observable<void> {
    const url = `${this.apiUrl}/collections/${bookmarksId}/relationships/${this.urlMap.get(resourceType)}/`;
    const payload = { data: [{ type: this.resourceMap.get(resourceType), id: resourceId }] };

    return this.jsonApiService.delete(url, payload);
  }
}
