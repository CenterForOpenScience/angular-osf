import { PreprintSubmissionsSort } from '../../enums';

const ACTION_SCOPE = '[Preprint Moderation]';

export class GetPreprintProviders {
  static readonly type = `${ACTION_SCOPE} Get Preprint Providers`;
}

export class GetPreprintReviewActions {
  static readonly type = `${ACTION_SCOPE} Get Preprint Review Actions`;

  constructor(public page = 1) {}
}

export class GetPreprintProvider {
  static readonly type = `${ACTION_SCOPE} Get Preprint Provider`;

  constructor(public providerId: string) {}
}

export class GetPreprintSubmissions {
  static readonly type = `${ACTION_SCOPE} Get Preprint Submissions`;

  constructor(
    public provider: string,
    public status: string,
    public page?: number,
    public sort?: PreprintSubmissionsSort
  ) {}
}

export class GetPreprintWithdrawalSubmissions {
  static readonly type = `${ACTION_SCOPE} Get Preprint Withdrawal Submissions`;

  constructor(
    public provider: string,
    public status: string,
    public page?: number,
    public sort?: PreprintSubmissionsSort
  ) {}
}

export class GetPreprintSubmissionContributors {
  static readonly type = `${ACTION_SCOPE} Get Preprint Submission Contributors`;

  constructor(public preprintId: string) {}
}

export class GetPreprintWithdrawalSubmissionContributors {
  static readonly type = `${ACTION_SCOPE} Get Preprint Withdrawal Submission Contributors`;

  constructor(
    public submissionId: string,
    public preprintId: string
  ) {}
}
