export class GetRegistryComponents {
  static readonly type = '[RegistryComponents] Get Registry Components';
  constructor(
    public registryId: string,
    public page?: number,
    public pageSize?: number
  ) {}
}
