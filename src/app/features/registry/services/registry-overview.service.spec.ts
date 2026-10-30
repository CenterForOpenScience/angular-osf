import { MockProvider } from 'ng-mocks';

import { firstValueFrom, of } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { RegistryModerationMapper } from '@osf/features/moderation/mappers';
import { ReviewAction, ReviewActionsResponseJsonApi } from '@osf/features/moderation/models';
import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { IdentifiersMapper } from '@osf/shared/mappers/identifiers.mapper';
import { InstitutionsMapper } from '@osf/shared/mappers/institutions';
import { PageSchemaMapper, RegistrationMapper, RegistrationNodeMapper } from '@osf/shared/mappers/registration';
import { ReviewActionsMapper } from '@osf/shared/mappers/review-actions.mapper';
import { IdentifiersResponseJsonApi } from '@osf/shared/models/identifiers/identifier-json-api.model';
import { InstitutionsJsonApiResponse } from '@osf/shared/models/institutions/institution-json-api.model';
import { Institution } from '@osf/shared/models/institutions/institutions.model';
import { SchemaBlocksResponseJsonApi } from '@osf/shared/models/registration/schema-blocks-json-api.model';
import {
  SchemaResponseJsonApi,
  SchemaResponsesJsonApi,
} from '@osf/shared/models/registration/schema-response-json-api.model';
import { ReviewActionPayload } from '@osf/shared/models/review-action/review-action-payload.model';
import { ReviewActionPayloadJsonApi } from '@osf/shared/models/review-action/review-action-payload-json-api.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';

import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { MOCK_PROJECT_IDENTIFIERS } from '@testing/mocks/project-overview.mock';
import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { MOCK_PAGES_SCHEMA } from '@testing/mocks/registries.mock';
import { REVIEW_ACTION_MOCK } from '@testing/mocks/review-action.mock';
import { createMockSchemaResponse } from '@testing/mocks/schema-response.mock';
import { MOCK_API_URL, provideMockEnvironment } from '@testing/providers/environment.provider.mock';
import { JsonApiServiceMock, JsonApiServiceMockType } from '@testing/providers/json-api.service.mock';

import { RegistrationOverviewDataJsonApi, RegistrationOverviewResponse } from '../models';

import { RegistryOverviewService } from './registry-overview.service';

describe('RegistryOverviewService', () => {
  let service: RegistryOverviewService;
  let jsonApiService: JsonApiServiceMockType;

  const registryId = 'registry-1';
  const registrationData = {
    id: registryId,
    attributes: {
      pending_embargo_approval: false,
      pending_embargo_termination_approval: false,
      embargoed: false,
      pending_registration_approval: false,
      reviews_state: RegistrationReviewStates.Accepted,
      revision_state: RevisionReviewStates.Approved,
    },
    relationships: {
      registered_from: { data: { id: 'project-1' } },
      registration_schema: { links: { related: { href: 'https://api.test/schema/' } } },
      license: { data: { id: 'license-1' } },
      provider: { data: { id: 'osf' } },
      root: { data: { id: 'root-1' } },
      forks: { links: { related: { meta: { count: 3 } } } },
    },
  } as RegistrationOverviewDataJsonApi;
  const schemaResponse = createMockSchemaResponse('schema-response-1', RevisionReviewStates.Approved);

  function setup() {
    jsonApiService = JsonApiServiceMock.simple();

    TestBed.configureTestingModule({
      providers: [RegistryOverviewService, MockProvider(JsonApiService, jsonApiService), provideMockEnvironment()],
    });

    service = TestBed.inject(RegistryOverviewService);
  }

  function stubRegistrationNodeMapper() {
    return vi
      .spyOn(RegistrationNodeMapper, 'getRegistrationNodeAttributes')
      .mockReturnValue(MOCK_REGISTRATION_OVERVIEW_MODEL);
  }

  it('should expose apiUrl from environment', () => {
    setup();

    expect(service.apiUrl).toBe(MOCK_API_URL);
  });

  it('getRegistrationById should request registration and map response', async () => {
    setup();
    const apiResponse = {
      data: registrationData,
      meta: { anonymous: true },
    } as RegistrationOverviewResponse;
    stubRegistrationNodeMapper();
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getRegistrationById(registryId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/registrations/${registryId}/`, {
      related_counts: 'forks',
    });
    expect(response.isAnonymous).toBe(true);
    expect(response.registry).toEqual(
      expect.objectContaining({
        id: MOCK_REGISTRATION_OVERVIEW_MODEL.id,
        associatedProjectId: 'project-1',
        providerId: 'osf',
        licenseId: 'license-1',
        forksCount: 3,
      })
    );
  });

  it('getRegistrationById should default isAnonymous to false when meta is missing', async () => {
    setup();
    stubRegistrationNodeMapper();
    jsonApiService.get.mockReturnValue(of({ data: registrationData } as RegistrationOverviewResponse));

    const response = await firstValueFrom(service.getRegistrationById(registryId));

    expect(response.isAnonymous).toBe(false);
  });

  it('getInstitutions should request institutions and map response', async () => {
    setup();
    const apiResponse = { data: [] } as unknown as InstitutionsJsonApiResponse;
    const mappedInstitutions = [MOCK_INSTITUTION] as unknown as Institution[];
    const mapperSpy = vi.spyOn(InstitutionsMapper, 'fromInstitutionsResponse').mockReturnValue(mappedInstitutions);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getInstitutions(registryId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/registrations/${registryId}/institutions/`, {
      'page[size]': 100,
    });
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual(mappedInstitutions);
  });

  it('getRegistryIdentifiers should request identifiers and map response', async () => {
    setup();
    const apiResponse = { data: [] } as unknown as IdentifiersResponseJsonApi;
    const mapperSpy = vi.spyOn(IdentifiersMapper, 'fromJsonApi').mockReturnValue([MOCK_PROJECT_IDENTIFIERS]);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getRegistryIdentifiers(registryId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/registrations/${registryId}/identifiers/`);
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual([MOCK_PROJECT_IDENTIFIERS]);
  });

  it('getSchemaBlocks should append schema_blocks path without query string', async () => {
    setup();
    const schemaLink = 'https://api.test/v2/schemas/schema-1/';
    const apiResponse = { data: [] } as unknown as SchemaBlocksResponseJsonApi;
    const mapperSpy = vi.spyOn(PageSchemaMapper, 'fromSchemaBlocksResponse').mockReturnValue(MOCK_PAGES_SCHEMA);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getSchemaBlocks(schemaLink));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${schemaLink}schema_blocks/`, {
      'page[size]': 200,
      page: 1,
    });
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual(MOCK_PAGES_SCHEMA);
  });

  it('getSchemaBlocks should preserve query string when schema link has params', async () => {
    setup();
    const schemaLink = 'https://api.test/v2/schemas/schema-1/?version=2';
    const apiResponse = { data: [] } as unknown as SchemaBlocksResponseJsonApi;
    vi.spyOn(PageSchemaMapper, 'fromSchemaBlocksResponse').mockReturnValue(MOCK_PAGES_SCHEMA);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    await firstValueFrom(service.getSchemaBlocks(schemaLink));

    expect(jsonApiService.get).toHaveBeenCalledWith('https://api.test/v2/schemas/schema-1/schema_blocks/?version=2', {
      'page[size]': 200,
      page: 1,
    });
  });

  it('getSchemaResponses should request schema responses and map each item', async () => {
    setup();
    const apiItem = { id: 'schema-response-1' };
    const apiResponse = { data: [apiItem] } as unknown as SchemaResponsesJsonApi;
    const mapperSpy = vi.spyOn(RegistrationMapper, 'fromSchemaResponse').mockReturnValue(schemaResponse);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getSchemaResponses(registryId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/registrations/${registryId}/schema_responses/`);
    expect(mapperSpy).toHaveBeenCalledWith(apiItem);
    expect(response).toEqual([schemaResponse]);
  });

  it('getRegistryReviewActions should request actions and map each item', async () => {
    setup();
    const apiItem = { id: 'action-1' };
    const apiResponse = { data: [apiItem] } as unknown as ReviewActionsResponseJsonApi;
    const mappedAction = REVIEW_ACTION_MOCK as ReviewAction;
    const mapperSpy = vi.spyOn(RegistryModerationMapper, 'fromActionResponse').mockReturnValue(mappedAction);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getRegistryReviewActions(registryId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/registrations/${registryId}/actions/`);
    expect(mapperSpy).toHaveBeenCalledWith(apiItem);
    expect(response).toEqual([mappedAction]);
  });

  it('createSchemaResponse should post payload and map response', async () => {
    setup();
    const apiResponse = { data: { id: 'schema-response-1' } } as unknown as SchemaResponseJsonApi;
    const mapperSpy = vi.spyOn(RegistrationMapper, 'fromSchemaResponse').mockReturnValue(schemaResponse);
    jsonApiService.post.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.createSchemaResponse(registryId));

    expect(jsonApiService.post).toHaveBeenCalledWith(`${MOCK_API_URL}/schema_responses/`, {
      data: {
        type: 'schema_responses',
        relationships: {
          registration: {
            data: {
              type: 'registrations',
              id: registryId,
            },
          },
        },
      },
    });
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse.data);
    expect(response).toEqual(schemaResponse);
  });

  it('withdrawRegistration should patch registration and map response', async () => {
    setup();
    const justification = 'Withdrawing for testing';
    stubRegistrationNodeMapper();
    jsonApiService.patch.mockReturnValue(of(registrationData));

    const response = await firstValueFrom(service.withdrawRegistration(registryId, justification));

    expect(jsonApiService.patch).toHaveBeenCalledWith(`${MOCK_API_URL}/registrations/${registryId}/`, {
      data: {
        id: registryId,
        attributes: {
          withdrawal_justification: justification,
          pending_withdrawal: true,
        },
        relationships: {},
        type: 'registrations',
      },
    });
    expect(response).toEqual(
      expect.objectContaining({
        id: MOCK_REGISTRATION_OVERVIEW_MODEL.id,
        associatedProjectId: 'project-1',
        forksCount: 3,
      })
    );
  });

  it('makePublic should patch registration public flag and map response', async () => {
    setup();
    stubRegistrationNodeMapper();
    jsonApiService.patch.mockReturnValue(of(registrationData));

    const response = await firstValueFrom(service.makePublic(registryId));

    expect(jsonApiService.patch).toHaveBeenCalledWith(`${MOCK_API_URL}/registrations/${registryId}/`, {
      data: {
        id: registryId,
        attributes: {
          public: true,
        },
        relationships: {},
        type: 'registrations',
      },
    });
    expect(response).toEqual(
      expect.objectContaining({
        id: MOCK_REGISTRATION_OVERVIEW_MODEL.id,
        providerId: 'osf',
        forksCount: 3,
      })
    );
  });

  it('submitDecision should post review action for registrations', async () => {
    setup();
    const payload: ReviewActionPayload = {
      targetId: registryId,
      action: 'accept_submission',
      comment: 'Looks good',
    };
    const mappedParams = {
      data: { type: 'review_actions' },
    } as ReviewActionPayloadJsonApi<string, string>;
    const mapperSpy = vi.spyOn(ReviewActionsMapper, 'toReviewActionPayloadJsonApi').mockReturnValue(mappedParams);
    jsonApiService.post.mockReturnValue(of(undefined));

    const response = await firstValueFrom(service.submitDecision(payload, false));

    expect(mapperSpy).toHaveBeenCalledWith(payload, 'review_actions', 'registrations');
    expect(jsonApiService.post).toHaveBeenCalledWith(
      `${MOCK_API_URL}/registrations/${registryId}/actions/`,
      mappedParams
    );
    expect(response).toBeUndefined();
  });

  it('submitDecision should post schema response action for revisions', async () => {
    setup();
    const payload: ReviewActionPayload = {
      targetId: 'schema-response-1',
      action: 'approve',
      comment: 'Approved',
    };
    const mappedParams = {
      data: { type: 'schema_response_actions' },
    } as ReviewActionPayloadJsonApi<string, string>;
    const mapperSpy = vi.spyOn(ReviewActionsMapper, 'toReviewActionPayloadJsonApi').mockReturnValue(mappedParams);
    jsonApiService.post.mockReturnValue(of(undefined));

    const response = await firstValueFrom(service.submitDecision(payload, true));

    expect(mapperSpy).toHaveBeenCalledWith(payload, 'schema_response_actions', 'schema-responses');
    expect(jsonApiService.post).toHaveBeenCalledWith(
      `${MOCK_API_URL}/schema_responses/${payload.targetId}/actions/`,
      mappedParams
    );
    expect(response).toBeUndefined();
  });
});
