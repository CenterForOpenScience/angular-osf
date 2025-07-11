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

export class FetchInstitutionUsers {
  static readonly type = '[InstitutionsAdmin] Fetch Institution Users';
  constructor(
    public institutionId: string,
    public page = 1,
    public pageSize = 10,
    public sort = 'user_name',
    public filters?: Record<string, string>
  ) {}
}

export class SendUserMessage {
  static readonly type = '[InstitutionsAdmin] Send User Message';
  constructor(
    public userId: string,
    public institutionId: string,
    public messageText: string,
    public bccSender: boolean,
    public replyTo: boolean
  ) {}
}
