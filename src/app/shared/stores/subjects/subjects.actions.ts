import { ResourceType } from '@osf/shared/enums';
import { SubjectModel } from '@osf/shared/models';

export class FetchSubjects {
  static readonly type = '[Subjects] Fetch Subjects';

  constructor(
    public resourceType: ResourceType | undefined,
    public resourceId?: string,
    public search?: string,
    public isMetadataRegistry?: boolean
  ) {}
}

export class FetchSelectedSubjects {
  static readonly type = '[Subjects] Fetch Selected Subjects';

  constructor(
    public resourceId: string,
    public resourceType: ResourceType | undefined
  ) {}
}

export class FetchChildrenSubjects {
  static readonly type = '[Subjects] Fetch Children Subjects';

  constructor(public parentId: string) {}
}

export class UpdateResourceSubjects {
  static readonly type = '[Subjects] Update Resource Project';

  constructor(
    public resourceId: string,
    public resourceType: ResourceType | undefined,
    public subjects: SubjectModel[]
  ) {}
}
