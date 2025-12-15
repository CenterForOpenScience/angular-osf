import { CurrentResourceType } from '@shared/enums/resource-type.enum';

export class GetActivityLogs {
  static readonly type = '[ActivityLogs] Get Activity Logs';

  constructor(
    public resourceId: string,
    public resourceType: CurrentResourceType.Projects | CurrentResourceType.Registrations,
    public page = 1,
    public pageSize: number
  ) {}
}

export class ClearActivityLogs {
  static readonly type = '[ActivityLogs] Clear Activity Logs';
}
