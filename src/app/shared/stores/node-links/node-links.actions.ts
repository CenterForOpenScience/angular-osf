import { ComponentOverview } from '@osf/shared/models/components/components.models';
import { MyResourcesItem } from '@osf/shared/models/my-resources/my-resources.models';

export class CreateNodeLink {
  static readonly type = '[Node Links] Create Node Link';

  constructor(
    public currentProjectId: string,
    public resource: MyResourcesItem
  ) {}
}

export class GetLinkedResources {
  static readonly type = '[Node Links] Get Linked Resources';

  constructor(public projectId: string) {}
}

export class DeleteNodeLink {
  static readonly type = '[Node Links] Delete Node Link';

  constructor(
    public projectId: string,
    public linkedResource: ComponentOverview
  ) {}
}

export class ClearNodeLinks {
  static readonly type = '[Node Links] Clear Node Links';
}
