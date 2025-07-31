import { RegistrationQuestions } from '@osf/features/registry/models';

export class GetRegistryById {
  static readonly type = '[Registry Overview] Get Registry By Id';

  constructor(
    public id: string,
    public isComponentPage?: boolean
  ) {}
}

export class GetRegistrySubjects {
  static readonly type = '[Registry Overview] Get Registry Subjects';

  constructor(public registryId: string) {}
}

export class GetRegistryInstitutions {
  static readonly type = '[Registry Overview] Get Registry Institutions';

  constructor(public registryId: string) {}
}

export class GetSchemaBlocks {
  static readonly type = '[Registry Overview] Get Schema Blocks';

  constructor(
    public schemaLink: string,
    public questions: RegistrationQuestions
  ) {}
}

export class WithdrawRegistration {
  static readonly type = '[Registry Overview] Withdraw Registration';

  constructor(
    public registryId: string,
    public justification: string
  ) {}
}

export class MakePublic {
  static readonly type = '[Registry Overview] Make Public';

  constructor(public registryId: string) {}
}

export class SetRegistryCustomCitation {
  static readonly type = '[Registry Overview] Set Registry Custom Citation';

  constructor(public citation: string) {}
}
