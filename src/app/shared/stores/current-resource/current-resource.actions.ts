export class GetResource {
  static readonly type = '[ResourceType] Get Resource Type';
  constructor(public resourceId: string) {}
}
