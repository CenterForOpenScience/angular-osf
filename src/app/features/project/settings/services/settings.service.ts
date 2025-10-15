import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { SubscriptionFrequency } from '@osf/shared/enums';
import { NotificationSubscriptionMapper } from '@osf/shared/mappers';
import {
  BaseNodeDataJsonApi,
  NodeResponseJsonApi,
  NodeShortInfoModel,
  NotificationSubscription,
  NotificationSubscriptionGetResponseJsonApi,
  ResponseJsonApi,
  UpdateNodeRequestModel,
} from '@osf/shared/models';
import { JsonApiService } from '@shared/services';

import { SettingsMapper } from '../mappers';
import {
  NodeDetailsModel,
  ProjectSettingsDataJsonApi,
  ProjectSettingsModel,
  ProjectSettingsResponseJsonApi,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getProjectSettings(nodeId: string): Observable<ProjectSettingsModel> {
    return this.jsonApiService
      .get<ProjectSettingsResponseJsonApi>(`${this.apiUrl}/nodes/${nodeId}/settings/`)
      .pipe(map((response) => SettingsMapper.fromResponse(response, nodeId)));
  }

  updateProjectSettings(model: ProjectSettingsDataJsonApi): Observable<ProjectSettingsModel> {
    return this.jsonApiService
      .patch<ProjectSettingsResponseJsonApi>(`${this.apiUrl}/nodes/${model.id}/settings/`, { data: model })
      .pipe(map((response) => SettingsMapper.fromResponse(response, model.id)));
  }

  getNotificationSubscriptions(nodeId?: string): Observable<NotificationSubscription[]> {
    const params: Record<string, string> = {
      'filter[id]': `${nodeId}_file_updated`,
    };

    return this.jsonApiService
      .get<ResponseJsonApi<NotificationSubscriptionGetResponseJsonApi[]>>(`${this.apiUrl}/subscriptions/`, params)
      .pipe(
        map((responses) => responses.data.map((response) => NotificationSubscriptionMapper.fromGetResponse(response)))
      );
  }

  updateSubscription(id: string, frequency: SubscriptionFrequency): Observable<NotificationSubscription> {
    const request = NotificationSubscriptionMapper.toUpdateRequest(id, frequency, false);

    return this.jsonApiService
      .patch<NotificationSubscriptionGetResponseJsonApi>(`${this.apiUrl}/subscriptions/${id}/`, request)
      .pipe(map((response) => NotificationSubscriptionMapper.fromGetResponse(response)));
  }

  getProjectById(projectId: string): Observable<NodeDetailsModel> {
    const params = {
      'embed[]': ['affiliated_institutions', 'region'],
    };

    return this.jsonApiService
      .get<NodeResponseJsonApi>(`${this.apiUrl}/nodes/${projectId}/`, params)
      .pipe(map((response) => SettingsMapper.fromNodeResponse(response.data)));
  }

  updateProjectById(model: UpdateNodeRequestModel): Observable<NodeDetailsModel> {
    return this.jsonApiService
      .patch<BaseNodeDataJsonApi>(`${this.apiUrl}/nodes/${model?.data?.id}/`, model)
      .pipe(map((response) => SettingsMapper.fromNodeResponse(response)));
  }

  deleteProject(projects: NodeShortInfoModel[]): Observable<void> {
    const payload = {
      data: projects.map((project) => ({
        type: 'nodes',
        id: project.id,
      })),
    };

    const headers = {
      'Content-Type': 'application/vnd.api+json; ext=bulk',
    };

    return this.jsonApiService.delete(`${this.apiUrl}/nodes/`, payload, headers);
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

    return this.jsonApiService.delete(`${this.apiUrl}/institutions/${institutionId}/relationships/nodes/`, data);
  }
}
