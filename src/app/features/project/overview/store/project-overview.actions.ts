import { ResourceType } from '@shared/enums';

export class GetProjectById {
  static readonly type = '[Project Overview] Get Project By Id';

  constructor(public projectId: string) {}
}

export class UpdateProjectPublicStatus {
  static readonly type = '[Project Overview] Update Project Public Status';

  constructor(
    public projectId: string,
    public isPublic: boolean
  ) {}
}

export class ForkResource {
  static readonly type = '[Project Overview] Fork Resource';

  constructor(
    public projectId: string,
    public resourceType: ResourceType
  ) {}
}

export class DuplicateProject {
  static readonly type = '[Project Overview] Duplicate Project';

  constructor(
    public projectId: string,
    public title: string
  ) {}
}

export class ClearProjectOverview {
  static readonly type = '[Project Overview] Clear Project Overview';
}

export class CreateComponent {
  static readonly type = '[Project Overview] Create Component';

  constructor(
    public projectId: string,
    public title: string,
    public description: string | null,
    public tags: string[],
    public region: string | null,
    public affiliatedInstitutions: string[],
    public inheritContributors: boolean
  ) {}
}

export class DeleteComponent {
  static readonly type = '[Project Overview] Delete Component';

  constructor(public componentId: string) {}
}

export class GetComponents {
  static readonly type = '[Project Overview] Get Components';

  constructor(public projectId: string) {}
}

export class GetLinkedProjects {
  static readonly type = '[Project Overview] Get Linked Projects';

  constructor(public projectId: string) {}
}
