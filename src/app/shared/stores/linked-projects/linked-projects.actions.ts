export class GetAllLinkedProjects {
  static readonly type = '[Forks] Get All Linked Projects';

  constructor(
    public resourceId: string,
    public resourceType: string,
    public page: number,
    public pageSize: number
  ) {}
}

export class ClearLinkedProjects {
  static readonly type = '[Forks] Clear Linked Projects';
}
