export class SetCreator {
  static readonly type = '[Preprints Resource Filters] Set Creator';

  constructor(
    public name: string,
    public id: string
  ) {}
}

export class SetDateCreated {
  static readonly type = '[Preprints Resource Filters] Set DateCreated';

  constructor(public date: string) {}
}

export class SetSubject {
  static readonly type = '[Preprints Resource Filters] Set Subject';

  constructor(
    public subject: string,
    public id: string
  ) {}
}

export class SetInstitution {
  static readonly type = '[Preprints Resource Filters] Set Institution';

  constructor(
    public institution: string,
    public id: string
  ) {}
}

export class SetLicense {
  static readonly type = '[Preprints Resource Filters] Set License';

  constructor(
    public license: string,
    public id: string
  ) {}
}

export class SetProvider {
  static readonly type = '[Preprints Resource Filters] Set Provider';

  constructor(
    public provider: string,
    public id: string
  ) {}
}

export class ResetFiltersState {
  static readonly type = '[Preprints Resource Filters] Reset State';
}
