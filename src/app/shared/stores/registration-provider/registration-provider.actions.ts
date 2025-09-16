const stateName = '[Registry Provider Search]';

export class GetRegistryProviderBrand {
  static readonly type = `${stateName}  Get Registry Provider Brand`;

  constructor(public providerName: string) {}
}
