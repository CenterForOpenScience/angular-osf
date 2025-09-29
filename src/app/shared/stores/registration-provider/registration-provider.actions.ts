const stateName = '[Registry Provider Search]';

export class GetRegistryProvider {
  static readonly type = `${stateName}  Get Registry Provider`;

  constructor(public providerName: string) {}
}

export class ClearRegistryProvider {
  static readonly type = `${stateName}  Clear Registry Provider`;
}
