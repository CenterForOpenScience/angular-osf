export class GetSubjects {
  static readonly type = '[Subjects] Get Subjects';
}

export class UpdateProjectSubjects {
  static readonly type = '[Subjects] Update Project';
  constructor(
    public projectId: string,
    public subjectIds: string[]
  ) {}
}

export class FetchSubjects {
  static readonly type = '[Subjects] Fetch Subjects';
  constructor(public search?: string) {}
}

export class FetchChildrenSubjects {
  static readonly type = '[Subjects] Fetch Children Subjects';
  constructor(public parentId: string) {}
}
