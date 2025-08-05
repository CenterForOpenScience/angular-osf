import { finalize, map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services';

import { ResourceType } from '../enums';
import { GuidedResponseJsonApi } from '../models';

import { LoaderService } from './loader.service';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResourceTypeService {
  private jsonApiService = inject(JsonApiService);
  private loaderService = inject(LoaderService);

  getResourceType(id: string): Observable<ResourceType> {
    const baseUrl = `${environment.apiUrl}/guids/${id}/`;

    this.loaderService.show();

    return this.jsonApiService.get<GuidedResponseJsonApi>(baseUrl).pipe(
      map((res) => (res.data.type === 'nodes' ? ResourceType.Project : ResourceType.Registration)),
      finalize(() => this.loaderService.hide())
    );
  }
}
