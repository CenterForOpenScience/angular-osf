export class GetRegistrations {
  static readonly type = '[Registrations] Get Registrations';

  constructor(
    public projectId: string,
    public page = 1,
    public pageSize = 10
  ) {}
}
