import { ReviewActionPayload } from '@osf/shared/models/review-action/review-action-payload.model';

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

export class ClearCollectionModeration {
  static readonly type = '[Collections Moderation] ClearCollectionModeration';
}
