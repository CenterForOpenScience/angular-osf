export class GetLinkedNodes {
  static readonly type = '[RegistryLinks] Get Linked Nodes';
  constructor(
    public registryId: string,
    public page?: number,
    public pageSize?: number
  ) {}
}

export class GetLinkedRegistrations {
  static readonly type = '[RegistryLinks] Get Linked Registrations';
  constructor(
    public registryId: string,
    public page?: number,
    public pageSize?: number
  ) {}
}

export class GetBibliographicContributors {
  static readonly type = '[RegistryLinks] Get Bibliographic Contributors';
  constructor(public nodeId: string) {}
}

export class GetBibliographicContributorsForRegistration {
  static readonly type = '[RegistryLinks] Get Bibliographic Contributors For Registration';
  constructor(public registrationId: string) {}
}
