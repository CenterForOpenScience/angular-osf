import { finalize, map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { CurrentResource, GuidedResponseJsonApi } from '@osf/shared/models';

import { CurrentResourceType } from '../enums';

import { JsonApiService } from './json-api.service';
import { LoaderService } from './loader.service';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResourceGuidService {
  private jsonApiService = inject(JsonApiService);
  private loaderService = inject(LoaderService);

  getResourceById(id: string): Observable<CurrentResource> {
    const baseUrl = `${environment.apiUrl}/guids/${id}/`;

    this.loaderService.show();

    return this.jsonApiService.get<GuidedResponseJsonApi>(baseUrl).pipe(
      map(
        (res) =>
          ({
            id: res.data.type === CurrentResourceType.Files ? res.data.attributes.guid : res.data.id,
            type: res.data.type,
            parentId:
              res.data.type === CurrentResourceType.Preprints
                ? res.data.relationships.provider?.data.id
                : res.data.relationships.target?.data.id,
            parentType:
              res.data.type === CurrentResourceType.Preprints
                ? res.data.relationships.provider?.data.type
                : res.data.relationships.target?.data.type,
          }) as CurrentResource
      ),
      finalize(() => this.loaderService.hide())
    );
  }
}
