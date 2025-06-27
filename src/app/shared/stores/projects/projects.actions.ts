export class GetAdminProjects {
  static readonly type = '[Projects] Get Admin Projects';

  constructor(public userId: string) {}
}
