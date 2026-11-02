import { MockProvider } from 'ng-mocks';

import { firstValueFrom, of } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { JSON_API_BULK_HEADERS } from '@osf/shared/constants/json-api-headers.const';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';
import { NotificationSubscriptionMapper } from '@osf/shared/mappers/notification-subscription.mapper';
import { BaseNodeDataJsonApi } from '@osf/shared/models/nodes/base-node-data-json-api.model';
import { NodeShortInfoModel } from '@osf/shared/models/nodes/node-with-children.model';
import { NodeResponseJsonApi, UpdateNodeRequestModel } from '@osf/shared/models/nodes/nodes-json-api.model';
import { NotificationSubscription } from '@osf/shared/models/notifications/notification-subscription.model';
import {
  NotificationSubscriptionDataJsonApi,
  NotificationSubscriptionsListResponseJsonApi,
} from '@osf/shared/models/notifications/notification-subscription-json-api.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';

import { MOCK_NODE_DETAILS } from '@testing/mocks/node-details.mock';
import { MOCK_NOTIFICATION_SUBSCRIPTIONS } from '@testing/mocks/notification-subscription.mock';
import { MOCK_API_URL, provideMockEnvironment } from '@testing/providers/environment.provider.mock';
import { JsonApiServiceMock, JsonApiServiceMockType } from '@testing/providers/json-api.service.mock';

import { SettingsMapper } from '../mappers';
import {
  NodeDetailsModel,
  ProjectSettingsDataJsonApi,
  ProjectSettingsModel,
  ProjectSettingsResponseJsonApi,
} from '../models';

import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;
  let jsonApiService: JsonApiServiceMockType;

  const nodeId = 'node-1';
  const mappedSettings = {
    id: nodeId,
    attributes: {
      accessRequestsEnabled: true,
      anyoneCanEditWiki: false,
      wikiEnabled: true,
    },
  } as ProjectSettingsModel;

  function setup() {
    jsonApiService = JsonApiServiceMock.simple();

    TestBed.configureTestingModule({
      providers: [SettingsService, MockProvider(JsonApiService, jsonApiService), provideMockEnvironment()],
    });

    service = TestBed.inject(SettingsService);
  }

  it('should expose apiUrl from environment', () => {
    setup();

    expect(service.apiUrl).toBe(MOCK_API_URL);
  });

  it('getProjectSettings should request node settings and map response', async () => {
    setup();
    const apiResponse = {
      data: {
        id: nodeId,
        type: 'node-settings',
        attributes: {
          access_requests_enabled: true,
          anyone_can_edit_wiki: false,
          wiki_enabled: true,
        },
      },
    } as ProjectSettingsResponseJsonApi;
    const mapperSpy = vi.spyOn(SettingsMapper, 'fromResponse').mockReturnValue(mappedSettings);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getProjectSettings(nodeId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/nodes/${nodeId}/settings/`);
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse, nodeId);
    expect(response).toEqual(mappedSettings);
  });

  it('updateProjectSettings should patch node settings and map response', async () => {
    setup();
    const model = {
      id: nodeId,
      type: 'node-settings',
      attributes: {
        access_requests_enabled: false,
        anyone_can_edit_wiki: true,
        wiki_enabled: false,
      },
    } as ProjectSettingsDataJsonApi;
    const mapperSpy = vi.spyOn(SettingsMapper, 'fromResponse').mockReturnValue(mappedSettings);
    jsonApiService.patch.mockReturnValue(of(model));

    const response = await firstValueFrom(service.updateProjectSettings(model));

    expect(jsonApiService.patch).toHaveBeenCalledWith(`${MOCK_API_URL}/nodes/${nodeId}/settings/`, { data: model });
    expect(mapperSpy).toHaveBeenCalledWith(model, nodeId);
    expect(response).toEqual(mappedSettings);
  });

  it('getNotificationSubscriptions should request filtered subscriptions and map response', async () => {
    setup();
    const apiItem = {
      id: `${nodeId}_file_updated`,
      type: 'subscription',
      attributes: {
        event_name: 'file_updated',
        frequency: SubscriptionFrequency.Daily,
      },
    } as NotificationSubscriptionDataJsonApi;
    const apiResponse = { data: [apiItem] } as NotificationSubscriptionsListResponseJsonApi;
    const mapped = [MOCK_NOTIFICATION_SUBSCRIPTIONS[0]];
    const mapperSpy = vi.spyOn(NotificationSubscriptionMapper, 'fromGetResponse').mockReturnValue(mapped[0]);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getNotificationSubscriptions(nodeId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/subscriptions/`, {
      'filter[id]': `${nodeId}_file_updated`,
    });
    expect(mapperSpy).toHaveBeenCalledWith(apiItem);
    expect(response).toEqual(mapped);
  });

  it('updateSubscription should patch subscription and map response', async () => {
    setup();
    const subscriptionId = `${nodeId}_file_updated`;
    const request = NotificationSubscriptionMapper.toUpdateRequest(
      subscriptionId,
      SubscriptionFrequency.Instant,
      false
    );
    const apiResponse = {
      id: subscriptionId,
      type: 'subscription',
      attributes: {
        event_name: 'file_updated',
        frequency: SubscriptionFrequency.Instant,
      },
    } as NotificationSubscriptionDataJsonApi;
    const mapped = {
      id: subscriptionId,
      event: MOCK_NOTIFICATION_SUBSCRIPTIONS[0].event,
      frequency: SubscriptionFrequency.Instant,
    } as NotificationSubscription;
    const toRequestSpy = vi.spyOn(NotificationSubscriptionMapper, 'toUpdateRequest').mockReturnValue(request);
    const fromResponseSpy = vi.spyOn(NotificationSubscriptionMapper, 'fromGetResponse').mockReturnValue(mapped);
    jsonApiService.patch.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.updateSubscription(subscriptionId, SubscriptionFrequency.Instant));

    expect(toRequestSpy).toHaveBeenCalledWith(subscriptionId, SubscriptionFrequency.Instant, false);
    expect(jsonApiService.patch).toHaveBeenCalledWith(`${MOCK_API_URL}/subscriptions/${subscriptionId}/`, request);
    expect(fromResponseSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual(mapped);
  });

  it('getProjectById should request node with embeds and map response', async () => {
    setup();
    const nodeData = { id: nodeId } as BaseNodeDataJsonApi;
    const apiResponse = { data: nodeData } as NodeResponseJsonApi;
    const mapperSpy = vi.spyOn(SettingsMapper, 'fromNodeResponse').mockReturnValue(MOCK_NODE_DETAILS);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getProjectById(nodeId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/nodes/${nodeId}/`, {
      'embed[]': ['affiliated_institutions', 'region'],
    });
    expect(mapperSpy).toHaveBeenCalledWith(nodeData);
    expect(response).toEqual(MOCK_NODE_DETAILS);
  });

  it('updateProjectById should patch node and map response', async () => {
    setup();
    const model = {
      data: {
        type: 'nodes',
        id: nodeId,
        attributes: { title: 'New Title', description: 'New Description' },
      },
    } as UpdateNodeRequestModel;
    const apiResponse = { id: nodeId } as BaseNodeDataJsonApi;
    const mapped = { ...MOCK_NODE_DETAILS, title: 'New Title' } as NodeDetailsModel;
    const mapperSpy = vi.spyOn(SettingsMapper, 'fromNodeResponse').mockReturnValue(mapped);
    jsonApiService.patch.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.updateProjectById(model));

    expect(jsonApiService.patch).toHaveBeenCalledWith(`${MOCK_API_URL}/nodes/${nodeId}/`, model);
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual(mapped);
  });

  it('deleteProject should bulk delete nodes', async () => {
    setup();
    const projects = [
      { id: 'node-1', title: 'One' },
      { id: 'node-2', title: 'Two' },
    ] as NodeShortInfoModel[];
    jsonApiService.delete.mockReturnValue(of(void 0));

    await firstValueFrom(service.deleteProject(projects));

    expect(jsonApiService.delete).toHaveBeenCalledWith(
      `${MOCK_API_URL}/nodes/`,
      {
        data: [
          { id: 'node-1', type: CurrentResourceType.Projects },
          { id: 'node-2', type: CurrentResourceType.Projects },
        ],
      },
      JSON_API_BULK_HEADERS
    );
  });

  it('deleteInstitution should delete institution node relationship', async () => {
    setup();
    const institutionId = 'inst-1';
    jsonApiService.delete.mockReturnValue(of(void 0));

    await firstValueFrom(service.deleteInstitution(institutionId, nodeId));

    expect(jsonApiService.delete).toHaveBeenCalledWith(
      `${MOCK_API_URL}/institutions/${institutionId}/relationships/nodes/`,
      {
        data: [{ type: 'nodes', id: nodeId }],
      }
    );
  });
});
