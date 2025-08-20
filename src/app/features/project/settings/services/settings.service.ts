import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@shared/services';

import { SettingsMapper } from '../mappers';
import { ProjectSettingsData, ProjectSettingsModel, ProjectSettingsResponseModel } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly baseUrl = environment.apiUrl;

  private readonly jsonApiService = inject(JsonApiService);

  getProjectSettings(nodeId: string): Observable<ProjectSettingsModel> {
    return this.jsonApiService
      .get<ProjectSettingsResponseModel>(`${this.baseUrl}/nodes/${nodeId}/settings`)
      .pipe(map((response) => SettingsMapper.fromResponse(response, nodeId)));
  }

  updateProjectSettings(model: ProjectSettingsData): Observable<ProjectSettingsModel> {
    return this.jsonApiService
      .patch<ProjectSettingsResponseModel>(`${this.baseUrl}/nodes/${model.id}/settings`, { data: model })
      .pipe(map((response) => SettingsMapper.fromResponse(response, model.id)));
  }

  deleteProject(projectId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.baseUrl}/nodes/${projectId}`);
  }
}
