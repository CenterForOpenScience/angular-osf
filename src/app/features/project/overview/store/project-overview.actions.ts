import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { ResourceType } from '@shared/enums/resource-type.enum';

import { PrivacyStatusModel } from '../models';

export class GetProjectById {
  static readonly type = '[Project Overview] Get Project By Id';

  constructor(public projectId: string) {}
}

export class UpdateProjectPublicStatus {
  static readonly type = '[Project Overview] Update Project Public Status';

  constructor(public payload: PrivacyStatusModel[]) {}
}

export class SetProjectCustomCitation {
  static readonly type = '[Project Overview] Set Project Custom Citation';

  constructor(public citation: string) {}
}

export class ForkResource {
  static readonly type = '[Project Overview] Fork Resource';

  constructor(
    public resourceId: string,
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

export class ClearDuplicatedProject {
  static readonly type = '[Project Overview] Clear Duplicated Project';
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

  constructor(
    public projectId: string,
    public page = 1,
    public pageSize = DEFAULT_TABLE_PARAMS.rows
  ) {}
}

export class LoadMoreComponents {
  static readonly type = '[Project Overview] Load More Components';

  constructor(public projectId: string) {}
}

export class GetParentProject {
  static readonly type = '[Project Overview] Get Parent Project';

  constructor(public projectId: string) {}
}
