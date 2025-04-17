import { inject, Injectable } from '@angular/core';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { map, Observable } from 'rxjs';
import { Project } from '@osf/features/home/models/project.entity';
import { mapProjectUStoProject } from '@osf/features/home/mappers/dashboard.mapper';
import { ProjectItem } from '@osf/features/home/models/raw-models/ProjectItem.entity';
import { environment } from '../../../environments/environment';
import { JsonApiResponse } from '@core/services/json-api/json-api.entity';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  jsonApiService = inject(JsonApiService);

  getProjects(): Observable<Project[]> {
    const userId = '8bxwv';
    const params = {
      'embed[]': ['bibliographic_contributors', 'parent', 'root'],
      page: 1,
      sort: '-last_logged',
    };

    return this.jsonApiService
      .get<
        JsonApiResponse<ProjectItem[], null>
      >(`${environment.apiUrl}/sparse/users/${userId}/nodes/`, params)
      .pipe(map((response) => response.data.map(mapProjectUStoProject)));
  }

  getNoteworthy(): Observable<Project[]> {
    const projectId = 'pf5z9';
    const params = {
      embed: 'bibliographic_contributors',
      'page[size]': 5,
    };

    return this.jsonApiService
      .get<
        JsonApiResponse<ProjectItem[], null>
      >(`${environment.apiUrl}/nodes/${projectId}/linked_nodes`, params)
      .pipe(map((response) => response.data.map(mapProjectUStoProject)));
  }

  getMostPopular(): Observable<Project[]> {
    const projectId = 'kvw3y';
    const params = {
      embed: 'bibliographic_contributors',
      'page[size]': 5,
    };

    return this.jsonApiService
      .get<
        JsonApiResponse<ProjectItem[], null>
      >(`${environment.apiUrl}/nodes/${projectId}/linked_nodes`, params)
      .pipe(map((response) => response.data.map(mapProjectUStoProject)));
  }
}
