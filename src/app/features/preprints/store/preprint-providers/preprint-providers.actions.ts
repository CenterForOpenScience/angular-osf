export class GetPreprintProviderById {
  static readonly type = '[Preprint Providers] Get Provider By Id';

  constructor(public id: string) {}
}

export class GetHighlightedSubjectsByProviderId {
  static readonly type = '[Preprint Providers] Get Highlighted Subjects By Provider Id';

  constructor(public providerId: string) {}
}

export class GetPreprintProvidersToAdvertise {
  static readonly type = '[Preprint Providers] Get Preprint Providers To Advertise';
}

export class GetPreprintProvidersAllowingSubmissions {
  static readonly type = '[Preprint Providers] Get Preprint Providers That Allows Submissions';
}
