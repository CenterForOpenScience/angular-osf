import { finalize, map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { CurrentResource, GuidedResponseJsonApi } from '@osf/shared/models';

import { environment } from '../../../environments/environment';

import { JsonApiService } from './json-api.service';
import { LoaderService } from './loader.service';

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
            id: res.data.id,
            type: res.data.type,
          }) as CurrentResource
      ),
      finalize(() => this.loaderService.hide())
    );
  }
}
