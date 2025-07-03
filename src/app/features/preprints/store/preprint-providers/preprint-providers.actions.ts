export class GetPreprintProviderById {
  static readonly type = '[Preprints] Get Provider By Id';

  constructor(public id: string) {}
}

export class GetHighlightedSubjectsByProviderId {
  static readonly type = '[Preprints] Get Highlighted Subjects By Provider Id';

  constructor(public providerId: string) {}
}

export class GetPreprintProvidersToAdvertise {
  static readonly type = '[Preprints] Get Preprint Providers To Advertise';
}

export class GetPreprintProvidersAllowingSubmissions {
  static readonly type = '[Preprints] Get Preprint Providers That Allows Submissions';
}
