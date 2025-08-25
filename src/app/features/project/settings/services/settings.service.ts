import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { UpdateNodeRequestModel } from '@osf/shared/models';
import { JsonApiService } from '@shared/services';

import { SettingsMapper } from '../mappers';
import {
  NodeDetailsModel,
  NodeResponseJsonApi,
  ProjectSettingsData,
  ProjectSettingsModel,
  ProjectSettingsResponseModel,
} from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly baseUrl = environment.apiUrl;

  private readonly jsonApiService = inject(JsonApiService);

  getProjectSettings(nodeId: string): Observable<ProjectSettingsModel> {
    return this.jsonApiService
      .get<ProjectSettingsResponseModel>(`${this.baseUrl}/nodes/${nodeId}/settings/`)
      .pipe(map((response) => SettingsMapper.fromResponse(response, nodeId)));
  }

  updateProjectSettings(model: ProjectSettingsData): Observable<ProjectSettingsModel> {
    return this.jsonApiService
      .patch<ProjectSettingsResponseModel>(`${this.baseUrl}/nodes/${model.id}/settings/`, { data: model })
      .pipe(map((response) => SettingsMapper.fromResponse(response, model.id)));
  }

  getProjectById(projectId: string): Observable<NodeDetailsModel> {
    const params = {
      'embed[]': ['affiliated_institutions', 'region'],
    };
    return this.jsonApiService
      .get<NodeResponseJsonApi>(`${this.baseUrl}/nodes/${projectId}/`, params)
      .pipe(map((response) => SettingsMapper.fromNodeResponse(response.data)));
  }

  updateProjectById(model: UpdateNodeRequestModel): Observable<NodeDetailsModel> {
    return this.jsonApiService
      .patch<NodeResponseJsonApi>(`${this.baseUrl}/nodes/${model?.data?.id}/`, model)
      .pipe(map((response) => SettingsMapper.fromNodeResponse(response.data)));
  }

  deleteProject(projectId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.baseUrl}/nodes/${projectId}/`);
  }

  deleteInstitution(institutionId: string, projectId: string): Observable<void> {
    const data = {
      data: [
        {
          type: 'nodes',
          id: projectId,
        },
      ],
    };

    return this.jsonApiService.delete(`${this.baseUrl}/institutions/${institutionId}/relationships/nodes/`, data);
  }
}
