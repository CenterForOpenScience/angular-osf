export class CreateNodeLink {
  static readonly type = '[Node Links] Create Node Link';

  constructor(
    public currentProjectId: string,
    public linkProjectId: string
  ) {}
}

export class GetAllNodeLinks {
  static readonly type = '[Node Links] Get All Node Links';

  constructor(public projectId: string) {}
}

export class GetLinkedResources {
  static readonly type = '[Node Links] Get Linked Resources';

  constructor(public projectId: string) {}
}

export class DeleteNodeLink {
  static readonly type = '[Node Links] Delete Node Link';

  constructor(
    public projectId: string,
    public nodeLinkId: string
  ) {}
}

export class ClearNodeLinks {
  static readonly type = '[Node Links] Clear Node Links';
}
