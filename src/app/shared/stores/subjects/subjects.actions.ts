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
