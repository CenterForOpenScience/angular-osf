export class GetActivityLogs {
  static readonly type = '[ActivityLogs] Get Activity Logs';

  constructor(
    public projectId: string,
    public page = '1',
    public pageSize: string
  ) {}
}

export class ClearActivityLogsStore {
  static readonly type = '[ActivityLogs] Clear Store';
}
