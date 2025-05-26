export class SetCreator {
  static readonly type = '[ My Profile Resource Filters] Set Creator';
  constructor(
    public name: string,
    public id: string
  ) {}
}

export class SetDateCreated {
  static readonly type = '[ My Profile Resource Filters] Set DateCreated';
  constructor(public date: string) {}
}

export class SetFunder {
  static readonly type = '[ My Profile Resource Filters] Set Funder';
  constructor(
    public funder: string,
    public id: string
  ) {}
}

export class SetSubject {
  static readonly type = '[ My Profile Resource Filters] Set Subject';
  constructor(
    public subject: string,
    public id: string
  ) {}
}

export class SetLicense {
  static readonly type = '[ My Profile Resource Filters] Set License';
  constructor(
    public license: string,
    public id: string
  ) {}
}

export class SetResourceType {
  static readonly type = '[ My Profile Resource Filters] Set Resource Type';
  constructor(
    public resourceType: string,
    public id: string
  ) {}
}

export class SetInstitution {
  static readonly type = '[ My Profile Resource Filters] Set Institution';
  constructor(
    public institution: string,
    public id: string
  ) {}
}

export class SetProvider {
  static readonly type = '[ My Profile Resource Filters] Set Provider';
  constructor(
    public provider: string,
    public id: string
  ) {}
}

export class SetPartOfCollection {
  static readonly type = '[ My Profile Resource Filters] Set PartOfCollection';
  constructor(
    public partOfCollection: string,
    public id: string
  ) {}
}
