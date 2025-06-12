export class GetCreatorsOptions {
  static readonly type = '[Preprints Resource Filters Options] Get Creators';

  constructor(public searchName: string) {}
}

export class GetDatesCreatedOptions {
  static readonly type = '[Preprints Resource Filters Options] Get Dates Created';
}

export class GetSubjectsOptions {
  static readonly type = '[Preprints Resource Filters Options] Get Subjects';
}

export class GetInstitutionsOptions {
  static readonly type = '[Preprints Resource Filters Options] Get Institutions';
}

export class GetLicensesOptions {
  static readonly type = '[Preprints Resource Filters Options] Get Licenses';
}

export class GetProvidersOptions {
  static readonly type = '[Preprints Resource Filters Options] Get Providers';
}

export class GetAllOptions {
  static readonly type = '[Preprints Resource Filters Options] Get All Options';
}
