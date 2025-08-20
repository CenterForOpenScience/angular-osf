import { CurrentResource } from '@osf/shared/models';

export class GetResource {
  static readonly type = '[ResourceType] Get Resource Type';
  constructor(public resourceId: string) {}
}

export class SetResource {
  static readonly type = '[ResourceType] Set Resource Type';
  constructor(public resource: CurrentResource) {}
}

export class ClearResourceType {
  static readonly type = '[ResourceType] Clear Resource Type';
}
