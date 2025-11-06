import { ResourceType } from '@shared/enums/resource-type.enum';
import { CustomCitationPayload } from '@shared/models/citations/custom-citation-payload.model';

export class GetDefaultCitations {
  static readonly type = '[Citations] Get Default Citations';

  constructor(
    public resourceType: ResourceType | string,
    public resourceId: string
  ) {}
}

export class GetCitationStyles {
  static readonly type = '[Citations] Get Citation Styles';

  constructor(public searchQuery?: string) {}
}

export class FetchDefaultProviderCitationStyles {
  static readonly type = '[Citations] Fetch Default Provider Citation Styles';

  constructor(
    public resourceType: ResourceType,
    public resourceId: string,
    public providerId: string
  ) {}
}

export class UpdateCustomCitation {
  static readonly type = '[Citations] Update Custom Citation';

  constructor(public payload: CustomCitationPayload) {}
}

export class GetStyledCitation {
  static readonly type = '[Citations] Get Styled Citation';

  constructor(
    public resourceType: ResourceType | string,
    public resourceId: string,
    public citationStyle: string
  ) {}
}

export class ClearStyledCitation {
  static readonly type = '[Citations] Clear Styled Citation';
}
