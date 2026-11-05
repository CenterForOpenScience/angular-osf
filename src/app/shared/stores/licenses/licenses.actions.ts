export class FetchLicenses {
  static readonly type = '[Licenses] Fetch Licenses';

  constructor(public licensesUrl?: string) {}
}

export class FetchLicense {
  static readonly type = '[Licenses] Fetch License';

  constructor(public licenseId?: string) {}
}
