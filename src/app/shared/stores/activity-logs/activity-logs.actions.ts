export class GetActivityLogs {
  static readonly type = '[ActivityLogs] Get Activity Logs';

  constructor(
    public projectId: string,
    public page = 1,
    public pageSize: number
  ) {}
}

export class GetRegistrationActivityLogs {
  static readonly type = '[ActivityLogs] Get Registration Activity Logs';
  constructor(
    public registrationId: string,
    public page = 1,
    public pageSize: number
  ) {}
}

export class ClearActivityLogsStore {
  static readonly type = '[ActivityLogs] Clear Store';
}
