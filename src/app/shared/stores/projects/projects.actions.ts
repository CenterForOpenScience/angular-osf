export class GetProjects {
  static readonly type = '[Projects] Get Projects';

  constructor(
    public userId: string,
    public params?: Record<string, unknown>
  ) {}
}
