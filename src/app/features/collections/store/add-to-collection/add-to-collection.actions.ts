import { CollectionSubmissionPayload } from '@shared/models';

export class GetCollectionLicenses {
  static readonly type = '[Add To Collection] Get Collection Licenses';

  constructor(public providerId: string) {}
}

export class CreateCollectionSubmission {
  static readonly type = '[Add To Collection] Create Collection Submission';

  constructor(public metadata: CollectionSubmissionPayload) {}
}

export class ClearAddToCollectionState {
  static readonly type = '[Add To Collection] Clear Add To Collection State';
}
