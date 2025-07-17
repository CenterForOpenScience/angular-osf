import { ResourceType } from '@shared/enums';

export class GetDefaultCitations {
  static readonly type = '[Citations] Get Default Citations';

  constructor(
    public resourceType: ResourceType,
    public resourceId: string
  ) {}
}

export class GetCitationStyles {
  static readonly type = '[Citations] Get Citation Styles';

  constructor(public searchQuery?: string) {}
}
