export class GetSubjects {
  static readonly type = '[Subjects] Get Subjects';
}

export class LoadProjectSubjects {
  static readonly type = '[Subjects] Load Project Subjects';

  constructor(public projectId: string) {}
}

export class GetParentSubjects {
  static readonly type = '[Subjects] Get Parent Subjects';
}

export class GetChildrenSubjects {
  static readonly type = '[Subjects] Get Children Subjects';

  constructor(
    public parentId: string,
    public greatParentId?: string
  ) {}
}

export class UpdateProjectSubjects {
  static readonly type = '[Subjects] Update Project';
  constructor(
    public projectId: string,
    public subjectIds: string[]
  ) {}
}
