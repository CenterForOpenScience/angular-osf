import { CollectionSubmissionPayload } from '@osf/shared/models/collections/collection-submission-payload.model';

import { RemoveCollectionSubmissionPayload } from '../../models/remove-collection-submission-payload.model';

export class GetCollectionLicenses {
  static readonly type = '[Add To Collection] Get Collection Licenses';

  constructor(public providerId: string) {}
}

export class GetCurrentCollectionSubmission {
  static readonly type = '[Add To Collection] Get Current Collection Submission';

  constructor(
    public collectionId: string,
    public projectId: string
  ) {}
}

export class CreateCollectionSubmission {
  static readonly type = '[Add To Collection] Create Collection Submission';

  constructor(public metadata: CollectionSubmissionPayload) {}
}

export class UpdateCollectionSubmission {
  static readonly type = '[Add To Collection] Update Collection Submission';

  constructor(public metadata: CollectionSubmissionPayload) {}
}

export class RemoveCollectionSubmission {
  static readonly type = '[Add To Collection] Delete Collection Submission';

  constructor(public payload: RemoveCollectionSubmissionPayload) {}
}

export class ClearAddToCollectionState {
  static readonly type = '[Add To Collection] Clear Add To Collection State';
}
