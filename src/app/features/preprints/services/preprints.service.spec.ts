import { MockProvider } from 'ng-mocks';

import { firstValueFrom, of, throwError } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { RegistryModerationMapper } from '@osf/features/moderation/mappers';
import { PreprintRequestActionsMapper, PreprintRequestMapper, PreprintsMapper } from '@osf/features/preprints/mappers';
import { SortOrder } from '@osf/shared/enums/sort-order.enum';
import {
  PreprintDataJsonApi,
  PreprintMetricsResponseJsonApi,
  PreprintResponseJsonApi,
  PreprintsListResponseJsonApi,
} from '@osf/shared/models/preprints/preprint-json-api.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_REQUEST_MOCK } from '@testing/mocks/preprint-request.mock';
import { PREPRINT_SHORT_INFO_ARRAY_MOCK } from '@testing/mocks/preprint-short-info.mock';
import { REVIEW_ACTION_MOCK } from '@testing/mocks/review-action.mock';
import { MOCK_API_URL, provideMockEnvironment } from '@testing/providers/environment.provider.mock';
import { JsonApiServiceMock, JsonApiServiceMockType } from '@testing/providers/json-api.service.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';

import {
  PreprintRequestAction,
  PreprintRequestActionsJsonApiResponse,
  PreprintRequestsJsonApiResponse,
} from '../models';

import { PreprintsService } from './preprints.service';

describe('PreprintsService', () => {
  let service: PreprintsService;
  let jsonApiService: JsonApiServiceMockType;
  let router: RouterMockType;

  const preprintId = 'preprint-1';
  const providerId = 'osf';
  const preprintResponse = { data: { id: preprintId } } as PreprintResponseJsonApi;
  const preprintData = { id: preprintId } as PreprintDataJsonApi;

  function setup() {
    jsonApiService = JsonApiServiceMock.simple();
    router = RouterMockBuilder.create().build();

    TestBed.configureTestingModule({
      providers: [
        PreprintsService,
        MockProvider(JsonApiService, jsonApiService),
        MockProvider(Router, router),
        provideMockEnvironment(),
      ],
    });

    service = TestBed.inject(PreprintsService);
  }

  it('should expose apiUrl from environment', () => {
    setup();

    expect(service.apiUrl).toBe(MOCK_API_URL);
  });

  it('createPreprint should post create payload and map response', async () => {
    setup();
    const mapperSpy = vi.spyOn(PreprintsMapper, 'fromPreprintJsonApi').mockReturnValue(PREPRINT_MOCK);
    jsonApiService.post.mockReturnValue(of(preprintResponse));

    const response = await firstValueFrom(service.createPreprint('Title', 'Abstract', providerId));

    expect(jsonApiService.post).toHaveBeenCalledWith(
      `${MOCK_API_URL}/preprints/`,
      PreprintsMapper.toCreatePayload('Title', 'Abstract', providerId)
    );
    expect(mapperSpy).toHaveBeenCalledWith(preprintResponse.data);
    expect(response).toEqual(PREPRINT_MOCK);
  });

  it('getById should request preprint and map response', async () => {
    setup();
    const mapperSpy = vi.spyOn(PreprintsMapper, 'fromPreprintJsonApi').mockReturnValue(PREPRINT_MOCK);
    jsonApiService.get.mockReturnValue(of(preprintResponse));

    const response = await firstValueFrom(service.getById(preprintId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/preprints/${preprintId}/`);
    expect(mapperSpy).toHaveBeenCalledWith(preprintResponse.data);
    expect(response).toEqual(PREPRINT_MOCK);
  });

  it('getByIdWithEmbeds should request embeds and map response', async () => {
    setup();
    const mapperSpy = vi.spyOn(PreprintsMapper, 'fromPreprintWithEmbedsJsonApi').mockReturnValue(PREPRINT_MOCK);
    jsonApiService.get.mockReturnValue(of(preprintResponse));

    const response = await firstValueFrom(service.getByIdWithEmbeds(preprintId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/preprints/${preprintId}/`, {
      'embed[]': ['license', 'identifiers'],
    });
    expect(mapperSpy).toHaveBeenCalledWith(preprintResponse);
    expect(response).toEqual(PREPRINT_MOCK);
  });

  it('getByIdWithEmbeds should navigate to spam content for flagged errors', async () => {
    setup();
    const error = {
      error: {
        errors: [{ meta: { flagged_content: true } }],
      },
    };
    jsonApiService.get.mockReturnValue(throwError(() => error));

    await expect(firstValueFrom(service.getByIdWithEmbeds(preprintId))).rejects.toEqual(error);
    expect(router.navigate).toHaveBeenCalledWith(['/spam-content']);
  });

  it('getByIdWithEmbeds should rethrow other errors without navigating', async () => {
    setup();
    const error = { error: { errors: [{ detail: 'not found' }] } };
    jsonApiService.get.mockReturnValue(throwError(() => error));

    await expect(firstValueFrom(service.getByIdWithEmbeds(preprintId))).rejects.toEqual(error);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('getPreprintMetrics should map downloads and views', async () => {
    setup();
    const metricsResponse = {
      meta: {
        metrics: {
          downloads: 12,
          views: 34,
        },
      },
    } as PreprintMetricsResponseJsonApi;
    jsonApiService.get.mockReturnValue(of(metricsResponse));

    const response = await firstValueFrom(service.getPreprintMetrics(preprintId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/preprints/${preprintId}/`, {
      'metrics[views]': 'total',
      'metrics[downloads]': 'total',
    });
    expect(response).toEqual({ downloads: 12, views: 34 });
  });

  it('updatePreprint should patch mapped attributes and skip undefined fields', async () => {
    setup();
    const mapperSpy = vi.spyOn(PreprintsMapper, 'fromPreprintJsonApi').mockReturnValue(PREPRINT_MOCK);
    jsonApiService.patch.mockReturnValue(of(preprintData));

    const response = await firstValueFrom(
      service.updatePreprint(preprintId, {
        title: 'Updated',
        hasCoi: true,
        doi: undefined,
      })
    );

    expect(jsonApiService.patch).toHaveBeenCalledWith(`${MOCK_API_URL}/preprints/${preprintId}/`, {
      data: {
        type: 'preprints',
        id: preprintId,
        attributes: {
          title: 'Updated',
          has_coi: true,
        },
      },
    });
    expect(mapperSpy).toHaveBeenCalledWith(preprintData);
    expect(response).toEqual(PREPRINT_MOCK);
  });

  it('submitPreprint should post submit review action payload', async () => {
    setup();
    jsonApiService.post.mockReturnValue(of({}));

    await firstValueFrom(service.submitPreprint(preprintId));

    expect(jsonApiService.post).toHaveBeenCalledWith(
      `${MOCK_API_URL}/preprints/${preprintId}/review_actions/`,
      PreprintsMapper.toReviewActionPayload(preprintId, 'submit')
    );
  });

  it('createNewVersion should post versions endpoint and map response', async () => {
    setup();
    const mapperSpy = vi.spyOn(PreprintsMapper, 'fromPreprintJsonApi').mockReturnValue(PREPRINT_MOCK);
    jsonApiService.post.mockReturnValue(of(preprintResponse));

    const response = await firstValueFrom(service.createNewVersion(preprintId));

    expect(jsonApiService.post).toHaveBeenCalledWith(`${MOCK_API_URL}/preprints/${preprintId}/versions/`);
    expect(mapperSpy).toHaveBeenCalledWith(preprintResponse.data);
    expect(response).toEqual(PREPRINT_MOCK);
  });

  it('getPreprintVersionIds should return version ids', async () => {
    setup();
    const listResponse = {
      data: [{ id: 'v1' }, { id: 'v2' }],
    } as PreprintsListResponseJsonApi;
    jsonApiService.get.mockReturnValue(of(listResponse));

    const response = await firstValueFrom(service.getPreprintVersionIds(preprintId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/preprints/${preprintId}/versions/`);
    expect(response).toEqual(['v1', 'v2']);
  });

  it('getMyPreprints should request user preprints with filters and map response', async () => {
    setup();
    const mapped = { data: PREPRINT_SHORT_INFO_ARRAY_MOCK, totalCount: 5 };
    const mapperSpy = vi.spyOn(PreprintsMapper, 'fromMyPreprintJsonApi').mockReturnValue(mapped);
    const listResponse = { data: [], meta: { total: 0 } } as PreprintsListResponseJsonApi;
    jsonApiService.get.mockReturnValue(of(listResponse));

    const response = await firstValueFrom(
      service.getMyPreprints(2, 25, {
        searchValue: 'alpha',
        searchFields: ['title', 'tags'],
        sortColumn: 'dateModified',
        sortOrder: SortOrder.Desc,
      })
    );

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/users/me/preprints/`, {
      'embed[]': ['bibliographic_contributors'],
      'fields[users]': 'family_name,full_name,given_name,middle_name',
      'fields[preprints]': 'title,date_modified,public,bibliographic_contributors,provider,is_migrated',
      'filter[title,tags]': 'alpha',
      page: 2,
      'page[size]': 25,
      sort: '-date_modified',
    });
    expect(mapperSpy).toHaveBeenCalledWith(listResponse);
    expect(response).toEqual(mapped);
  });

  it('getPreprintReviewActions should map review actions', async () => {
    setup();
    const actionData = { id: 'action-1' };
    const mapperSpy = vi.spyOn(RegistryModerationMapper, 'fromActionResponse').mockReturnValue(REVIEW_ACTION_MOCK);
    jsonApiService.get.mockReturnValue(of({ data: [actionData] }));

    const response = await firstValueFrom(service.getPreprintReviewActions(preprintId));

    expect(jsonApiService.get).toHaveBeenCalledWith(
      `${MOCK_API_URL}/preprints/${preprintId}/review_actions/?embed=creator`
    );
    expect(mapperSpy).toHaveBeenCalledWith(actionData);
    expect(response).toEqual([REVIEW_ACTION_MOCK]);
  });

  it('getPreprintRequests should map preprint requests', async () => {
    setup();
    const requestData = { id: 'request-1' };
    const mapperSpy = vi.spyOn(PreprintRequestMapper, 'fromPreprintRequest').mockReturnValue(PREPRINT_REQUEST_MOCK);
    jsonApiService.get.mockReturnValue(of({ data: [requestData] } as PreprintRequestsJsonApiResponse));

    const response = await firstValueFrom(service.getPreprintRequests(preprintId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/preprints/${preprintId}/requests/?embed=creator`);
    expect(mapperSpy).toHaveBeenCalledWith(requestData);
    expect(response).toEqual([PREPRINT_REQUEST_MOCK]);
  });

  it('getPreprintRequestActions should map request actions', async () => {
    setup();
    const requestId = 'request-1';
    const actionData = { id: 'request-action-1' };
    const mappedAction = { id: 'request-action-1' } as PreprintRequestAction;
    const mapperSpy = vi
      .spyOn(PreprintRequestActionsMapper, 'fromPreprintRequestActions')
      .mockReturnValue(mappedAction);
    jsonApiService.get.mockReturnValue(of({ data: [actionData] } as PreprintRequestActionsJsonApiResponse));

    const response = await firstValueFrom(service.getPreprintRequestActions(requestId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/requests/${requestId}/actions/`);
    expect(mapperSpy).toHaveBeenCalledWith(actionData);
    expect(response).toEqual([mappedAction]);
  });

  it('withdrawPreprint should post withdraw payload', async () => {
    setup();
    jsonApiService.post.mockReturnValue(of({}));

    await firstValueFrom(service.withdrawPreprint(preprintId, 'reason'));

    expect(jsonApiService.post).toHaveBeenCalledWith(
      `${MOCK_API_URL}/preprints/${preprintId}/requests/`,
      PreprintRequestMapper.toWithdrawPreprintPayload(preprintId, 'reason')
    );
  });

  it('submitReviewsDecision should post review decision payload', async () => {
    setup();
    jsonApiService.post.mockReturnValue(of({}));

    await firstValueFrom(service.submitReviewsDecision(preprintId, 'accept', 'looks good'));

    expect(jsonApiService.post).toHaveBeenCalledWith(
      `${MOCK_API_URL}/actions/reviews/`,
      PreprintsMapper.toReviewActionPayload(preprintId, 'accept', 'looks good')
    );
  });

  it('submitRequestsDecision should post request decision payload', async () => {
    setup();
    const requestId = 'request-1';
    jsonApiService.post.mockReturnValue(of({}));

    await firstValueFrom(service.submitRequestsDecision(requestId, 'accept', null));

    expect(jsonApiService.post).toHaveBeenCalledWith(
      `${MOCK_API_URL}/actions/requests/preprints/`,
      PreprintRequestActionsMapper.toRequestActionPayload(requestId, 'accept', null)
    );
  });
});
