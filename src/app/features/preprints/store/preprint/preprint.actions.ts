import { StringOrNull } from '@osf/shared/helpers/types.helper';

export class FetchPreprintById {
  static readonly type = '[Preprint] Fetch Preprint By Id';

  constructor(public id: string) {}
}

export class FetchPreprintFile {
  static readonly type = '[Preprint] Fetch Preprint File';
}

export class FetchPreprintFileVersions {
  static readonly type = '[Preprint] Fetch Preprint File Versions';
}

export class FetchPreprintVersionIds {
  static readonly type = '[Preprint] Fetch Preprint Version Ids';
}

export class FetchPreprintReviewActions {
  static readonly type = '[Preprint] Fetch Preprint Review Actions';
}

export class FetchPreprintRequests {
  static readonly type = '[Preprint] Fetch Preprint Requests';
}

export class FetchPreprintRequestActions {
  static readonly type = '[Preprint] Fetch Preprint Requests Actions';

  constructor(public requestId: string) {}
}

export class FetchPreprintMetrics {
  static readonly type = '[Preprint] Fetch Preprint Metrics';
}

export class WithdrawPreprint {
  static readonly type = '[Preprint] Withdraw Preprint';

  constructor(
    public preprintId: string,
    public justification: string
  ) {}
}

export class SubmitReviewsDecision {
  static readonly type = '[Preprint] Submit Reviews Decision';

  constructor(
    public trigger: string,
    public comment: StringOrNull
  ) {}
}

export class SubmitRequestsDecision {
  static readonly type = '[Preprint] Submit Request Decision';

  constructor(
    public requestId: string,
    public trigger: string,
    public comment: StringOrNull
  ) {}
}

export class ResetState {
  static readonly type = '[Preprint] Reset State';
}
