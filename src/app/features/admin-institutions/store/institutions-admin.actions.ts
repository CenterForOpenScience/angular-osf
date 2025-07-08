export class FetchInstitutionDepartments {
  static readonly type = '[InstitutionsAdmin] Fetch Institution Departments';
  constructor(public institutionId: string) {}
}

export class FetchInstitutionSummaryMetrics {
  static readonly type = '[InstitutionsAdmin] Fetch Institution Summary Metrics';
  constructor(public institutionId: string) {}
}

export class FetchInstitutionSearchResults {
  static readonly type = '[InstitutionsAdmin] Fetch Institution Search Results';
  constructor(
    public institutionId: string,
    public valueSearchPropertyPath: string,
    public additionalParams?: Record<string, string>
  ) {}
}

export class FetchHasOsfAddonSearch {
  static readonly type = '[InstitutionsAdmin] Fetch Has OSF Addon Search';
  constructor(public institutionId: string) {}
}

export class FetchStorageRegionSearch {
  static readonly type = '[InstitutionsAdmin] Fetch Storage Region Search';
  constructor(public institutionId: string) {}
}

export class SetSelectedInstitutionId {
  static readonly type = '[InstitutionsAdmin] Set Selected Institution Id';
  constructor(public institutionId: string) {}
}

export class ClearInstitutionsAdminData {
  static readonly type = '[InstitutionsAdmin] Clear Data';
}
