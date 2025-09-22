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
