import { map, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ResourceType } from '@shared/enums';
import { CitationsMapper } from '@shared/mappers';
import { DefaultCitation, DefaultCitationJsonApi } from '@shared/models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CitationsService {
  private readonly http = inject(HttpClient);

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
    [ResourceType.Preprint, 'preprints'],
  ]);

  getDefaultCitation(resourceType: ResourceType, resourceId: string, citationId: string): Observable<DefaultCitation> {
    const baseUrl = this.getBaseUrl(resourceType, resourceId);
    return this.http
      .get<DefaultCitationJsonApi>(`${baseUrl}/citation/${citationId}/`)
      .pipe(map((response) => CitationsMapper.fromGetDefaultResponse(response)));
  }

  private getBaseUrl(resourceType: ResourceType, resourceId: string): string {
    const baseUrl = `${environment.apiUrl}`;
    const resourcePath = this.urlMap.get(resourceType);

    if (!resourcePath) {
      throw new Error(`Unsupported resource type: ${resourceType}`);
    }

    return `${baseUrl}/${resourcePath}/${resourceId}/contributors`;
  }
}
