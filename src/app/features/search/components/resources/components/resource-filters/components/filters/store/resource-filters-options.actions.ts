export class GetCreatorsOptions {
  static readonly type = '[Resource Filters Options] Get Creators';

  constructor(public searchName: string) {}
}

export class GetDatesCreatedOptions {
  static readonly type = '[Resource Filters Options] Get Dates Created';
}

export class GetFundersOptions {
  static readonly type = '[Resource Filters Options] Get Funders';
}

export class GetSubjectsOptions {
  static readonly type = '[Resource Filters Options] Get Subjects';
}

export class GetLicensesOptions {
  static readonly type = '[Resource Filters Options] Get Licenses';
}

export class GetResourceTypesOptions {
  static readonly type = '[Resource Filters Options] Get Resource Types';
}

export class GetInstitutionsOptions {
  static readonly type = '[Resource Filters Options] Get Institutions';
}

export class GetProvidersOptions {
  static readonly type = '[Resource Filters Options] Get Providers';
}

export class GetPartOfCollectionOptions {
  static readonly type = '[Resource Filters Options] Get Part Of Collection Options';
}

export class GetAllOptions {
  static readonly type = '[Resource Filters Options] Get All Options';
}
