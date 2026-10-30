import { MockProvider } from 'ng-mocks';

import { firstValueFrom, of } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { CollectionsMapper } from '@osf/shared/mappers/collections';
import { ReviewActionsMapper } from '@osf/shared/mappers/review-actions.mapper';
import { CollectionSubmissionPayload } from '@osf/shared/models/collections/collection-submission-payload.model';
import { CollectionSubmissionPayloadJsonApi } from '@osf/shared/models/collections/collection-submission-payload-json-api.model';
import { ReviewActionPayloadJsonApi } from '@osf/shared/models/review-action/review-action-payload-json-api.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';

import { MOCK_API_URL, provideMockEnvironment } from '@testing/providers/environment.provider.mock';
import { JsonApiServiceMock, JsonApiServiceMockType } from '@testing/providers/json-api.service.mock';

import { RemoveCollectionSubmissionPayload } from '../models/remove-collection-submission-payload.model';

import { AddToCollectionService } from './add-to-collection.service';

describe('AddToCollectionService', () => {
  let service: AddToCollectionService;
  let jsonApiService: JsonApiServiceMockType;

  const submissionPayload: CollectionSubmissionPayload = {
    collectionId: 'collection-1',
    projectId: 'project-1',
    userId: 'user-1',
  };

  const removePayload: RemoveCollectionSubmissionPayload = {
    projectId: 'project-1',
    collectionId: 'collection-1',
    comment: 'Removing from collection',
  };

  function setup() {
    jsonApiService = JsonApiServiceMock.simple();

    TestBed.configureTestingModule({
      providers: [AddToCollectionService, MockProvider(JsonApiService, jsonApiService), provideMockEnvironment()],
    });

    service = TestBed.inject(AddToCollectionService);
  }

  it('should expose apiUrl from environment', () => {
    setup();

    expect(service.apiUrl).toBe(MOCK_API_URL);
  });

  it('createCollectionSubmission should map payload and post to collection submissions', async () => {
    setup();
    const mappedPayload = {
      data: {
        type: 'collection-submissions',
        attributes: { guid: 'project-1' },
        relationships: {
          collection: { data: { id: 'collection-1', type: 'collections' } },
          creator: { data: { type: 'users', id: 'user-1' } },
        },
      },
    } as CollectionSubmissionPayloadJsonApi;
    const mapperSpy = vi.spyOn(CollectionsMapper, 'toCollectionSubmissionRequest').mockReturnValue(mappedPayload);
    jsonApiService.post.mockReturnValue(of(undefined));

    const response = await firstValueFrom(service.createCollectionSubmission(submissionPayload));

    expect(mapperSpy).toHaveBeenCalledWith(submissionPayload);
    expect(jsonApiService.post).toHaveBeenCalledWith(
      `${MOCK_API_URL}/collections/${submissionPayload.collectionId}/collection_submissions/`,
      mappedPayload
    );
    expect(response).toBeUndefined();
  });

  it('removeCollectionSubmission should map review action and post to collection submission actions', async () => {
    setup();
    const mappedParams = {
      data: {
        type: 'collection_submission_actions',
        attributes: {
          trigger: 'remove',
          comment: removePayload.comment,
        },
        relationships: {
          target: {
            data: {
              type: 'collection-submissions',
              id: `${removePayload.projectId}-${removePayload.collectionId}`,
            },
          },
        },
      },
    } as ReviewActionPayloadJsonApi<string, string>;
    const mapperSpy = vi.spyOn(ReviewActionsMapper, 'toReviewActionPayloadJsonApi').mockReturnValue(mappedParams);
    jsonApiService.post.mockReturnValue(of(undefined));

    const response = await firstValueFrom(service.removeCollectionSubmission(removePayload));

    expect(mapperSpy).toHaveBeenCalledWith(
      {
        action: 'remove',
        targetId: `${removePayload.projectId}-${removePayload.collectionId}`,
        comment: removePayload.comment,
      },
      'collection_submission_actions',
      'collection-submissions'
    );
    expect(jsonApiService.post).toHaveBeenCalledWith(`${MOCK_API_URL}/collection_submission_actions/`, mappedParams);
    expect(response).toBeUndefined();
  });
});
