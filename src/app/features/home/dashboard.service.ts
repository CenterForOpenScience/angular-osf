import {inject, Injectable} from '@angular/core';
import {JsonApiService} from '@core/services/json-api/json-api.service';
import {map, Observable} from 'rxjs';
import {Project} from '@osf/features/home/models/project.entity';
import {mapProjectUStoProject} from '@osf/features/home/mappers/dashboard.mapper';
import {ProjectItem} from '@osf/features/home/models/raw-models/ProjectItem.entity';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  jsonApiService = inject(JsonApiService);

  getProjects(): Observable<Project[]> {
    const userId = 'k9p2t';
    const params = {
      embed: ['bibliographic_contributors', 'parent', 'root'],
      page: 1,
      sort: '-last_logged',
    };

    return this.jsonApiService.getArray<ProjectItem>(`https://api.staging4.osf.io/v2/sparse/users/${userId}`, params)
      .pipe(map(projects => projects.map(mapProjectUStoProject)))
  }
}
