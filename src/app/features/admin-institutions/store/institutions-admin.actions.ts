import { RequestProjectAccessData } from '../models';

export class FetchInstitutionById {
  static readonly type = '[InstitutionsAdmin] Fetch Institution By Id';

  constructor(public institutionId: string) {}
}

export class FetchInstitutionDepartments {
  static readonly type = '[InstitutionsAdmin] Fetch Institution Departments';
}

export class FetchInstitutionSummaryMetrics {
  static readonly type = '[InstitutionsAdmin] Fetch Institution Summary Metrics';
}

export class FetchInstitutionSearchResults {
  static readonly type = '[InstitutionsAdmin] Fetch Institution Search Results';

  constructor(
    public valueSearchPropertyPath: string,
    public additionalParams?: Record<string, string>
  ) {}
}

export class FetchHasOsfAddonSearch {
  static readonly type = '[InstitutionsAdmin] Fetch Has OSF Addon Search';
}

export class FetchStorageRegionSearch {
  static readonly type = '[InstitutionsAdmin] Fetch Storage Region Search';
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

export class RequestProjectAccess {
  static readonly type = '[InstitutionsAdmin] Request Project Access';

  constructor(public payload: RequestProjectAccessData) {}
}
