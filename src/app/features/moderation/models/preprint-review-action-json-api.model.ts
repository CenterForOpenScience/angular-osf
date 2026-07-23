import { Embed } from '@osf/shared/models/common/json-api/embeds.model';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ListResponse } from '@osf/shared/models/common/json-api/responses.model';
import { PreprintDataJsonApi } from '@osf/shared/models/preprints/preprint-json-api.model';
import { PreprintProviderAttributesJsonApi } from '@osf/shared/models/provider/preprints-provider-json-api.model';
import { UserDataErrorResponseJsonApi } from '@osf/shared/models/user/user-json-api.model';

export type PreprintReviewActionListResponseJsonApi = ListResponse<ReviewActionJsonApi>;

export interface ReviewActionJsonApi extends JsonApiResource<'review-actions', ReviewActionAttributesJsonApi> {
  embeds: ReviewActionEmbedsJsonApi;
}

interface ReviewActionAttributesJsonApi {
  auto: boolean;
  comment: string;
  date_created: string;
  date_modified: string;
  from_state: string;
  to_state: string;
  trigger: string;
}

interface ReviewActionEmbedsJsonApi {
  creator: UserDataErrorResponseJsonApi;
  provider: Embed<JsonApiResource<'preprint-providers', PreprintProviderAttributesJsonApi>>;
  target: Embed<PreprintDataJsonApi>;
}
