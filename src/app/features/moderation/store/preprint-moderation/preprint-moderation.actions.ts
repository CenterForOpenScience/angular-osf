const ACTION_SCOPE = '[Preprint Moderation]';

export class GetPreprintProviders {
  static readonly type = `${ACTION_SCOPE} Get Preprint Providers`;
}

export class GetPreprintReviewActions {
  static readonly type = `${ACTION_SCOPE} Get Preprint Review Actions`;

  constructor(public page = 1) {}
}
