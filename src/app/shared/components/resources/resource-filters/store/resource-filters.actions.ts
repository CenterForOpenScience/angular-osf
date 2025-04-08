import { ResourceType } from '@osf/features/search/models/resource-type.enum';

export class SetCreator {
  static readonly type = '[Resource Filters] Set Creator';
  constructor(public payload: string) {}
}

export class SetDateCreated {
  static readonly type = '[Resource Filters] Set DateCreated';
  constructor(public payload: Date) {}
}

export class SetFunder {
  static readonly type = '[Resource Filters] Set Funder';
  constructor(public payload: string) {}
}

export class SetSubject {
  static readonly type = '[Resource Filters] Set Subject';
  constructor(public payload: string) {}
}

export class SetLicense {
  static readonly type = '[Resource Filters] Set License';
  constructor(public payload: string) {}
}

export class SetResourceType {
  static readonly type = '[Resource Filters] Set Resource Type';
  constructor(public payload: ResourceType) {}
}

export class SetInstitution {
  static readonly type = '[Resource Filters] Set Institution';
  constructor(public payload: string) {}
}

export class SetProvider {
  static readonly type = '[Resource Filters] Set Provider';
  constructor(public payload: string) {}
}

export class SetPartOfCollection {
  static readonly type = '[Resource Filters] Set PartOfCollection';
  constructor(public payload: string) {}
}
