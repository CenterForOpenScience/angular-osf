import { ResourceType } from '@osf/shared/enums/resource-type.enum';

export class FetchLicenses {
  static readonly type = '[Licenses] Fetch Licenses';

  constructor(
    public resourceType: ResourceType,
    public providerId?: string
  ) {}
}
