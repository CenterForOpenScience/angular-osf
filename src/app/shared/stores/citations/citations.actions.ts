import { ResourceType } from '@shared/enums';
import { CustomCitationPayload } from '@shared/models';

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
