import { ReviewAction } from '@osf/features/moderation/models';
import { Preprint, PreprintRequestAction, PreprintShortInfo } from '@osf/features/preprints/models';
import { PreprintRequest } from '@osf/features/preprints/models/preprint-request.models';
import { AsyncStateModel, AsyncStateWithTotalCount, OsfFile, OsfFileVersion } from '@shared/models';

export interface PreprintStateModel {
  myPreprints: AsyncStateWithTotalCount<PreprintShortInfo[]>;
  preprint: AsyncStateModel<Preprint | null>;
  preprintFile: AsyncStateModel<OsfFile | null>;
  fileVersions: AsyncStateModel<OsfFileVersion[]>;
  preprintVersionIds: AsyncStateModel<string[]>;
  preprintReviewActions: AsyncStateModel<ReviewAction[]>;
  preprintRequests: AsyncStateModel<PreprintRequest[]>;
  preprintRequestsActions: AsyncStateModel<PreprintRequestAction[]>;
}

export const DefaultState: PreprintStateModel = {
  preprint: {
    data: null,
    isLoading: false,
    error: null,
    isSubmitting: false,
  },
  myPreprints: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
  preprintFile: {
    data: null,
    isLoading: false,
    error: null,
    isSubmitting: false,
  },
  fileVersions: {
    data: [],
    isLoading: false,
    error: null,
  },
  preprintVersionIds: {
    data: [],
    isLoading: false,
    error: null,
  },
  preprintReviewActions: {
    data: [],
    isLoading: false,
    error: null,
  },
  preprintRequests: {
    data: [],
    isLoading: false,
    error: null,
  },
  preprintRequestsActions: {
    data: [],
    isLoading: false,
    error: null,
  },
};
