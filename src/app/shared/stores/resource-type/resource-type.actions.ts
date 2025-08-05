import { ResourceType } from '@shared/enums';

export class SetResourceType {
  static readonly type = '[ResourceType] Set Resource Type';
  constructor(
    public resourceId: string,
    public resourceType: ResourceType
  ) {}
}

export class GetResourceType {
  static readonly type = '[ResourceType] Get Resource Type';
  constructor(public resourceId: string) {}
}

export class ClearResourceType {
  static readonly type = '[ResourceType] Clear Resource Type';
}
