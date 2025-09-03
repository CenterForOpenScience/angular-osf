import { ResourceType } from '@osf/shared/enums';

export class GetResource {
  static readonly type = '[ResourceType] Get Resource';
  constructor(public resourceId: string) {}
}

export class GetResourceDetails {
  static readonly type = '[Current Resource] Get Resource Details';
  constructor(
    public resourceId: string,
    public resourceType: ResourceType
  ) {}
}

export class GetResourceWithChildren {
  static readonly type = '[Current Resource] Get Resource With Children';
  constructor(
    public resourceId: string,
    public resourceType: ResourceType
  ) {}
}
