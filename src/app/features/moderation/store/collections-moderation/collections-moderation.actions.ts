import { CollectionSubmissionReviewAction } from '@osf/features/moderation/models';
import { CollectionSubmission, ReviewActionPayload } from '@shared/models';

export class GetCollectionSubmissions {
  static readonly type = '[Collections Moderation] Get Collection Submissions';

  constructor(
    public collectionId: string,
    public status: string,
    public page: string,
    public sortBy: string
  ) {}
}

export class GetSubmissionsReviewActions {
  static readonly type = '[Collections Moderation] Get Submission Actions';

  constructor(
    public submissionId: string,
    public collectionId: string
  ) {}
}

export class CreateCollectionSubmissionAction {
  static readonly type = '[Collections Moderation] Create Collection Submission Action';

  constructor(public payload: ReviewActionPayload) {}
}

export class SetCurrentSubmission {
  static readonly type = '[Collections Moderation] Set Current Submission';

  constructor(public submission: CollectionSubmission | null) {}
}

export class SetCurrentReviewAction {
  static readonly type = '[Collections Moderation] Set Current Review Action';

  constructor(public action: CollectionSubmissionReviewAction | null) {}
}

export class ClearCollectionModeration {
  static readonly type = '[Collections Moderation] ClearCollectionModeration';
}
