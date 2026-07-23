import { Embed } from '@osf/shared/models/common/json-api/embeds.model';
import { ListMetaJsonApi } from '@osf/shared/models/common/json-api/meta.model';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ListResponse } from '@osf/shared/models/common/json-api/responses.model';
import { PreprintAttributesJsonApi } from '@osf/shared/models/preprints/preprint-json-api.model';
import { UserDataErrorResponseJsonApi } from '@osf/shared/models/user/user-json-api.model';

export type PreprintSubmissionWithdrawalResponseJsonApi = ListResponse<PreprintWithdrawalSubmissionDataJsonApi> & {
  meta: PreprintWithdrawalSubmissionMetaJsonApi;
};

export interface PreprintWithdrawalSubmissionDataJsonApi extends JsonApiResource<
  'preprint-withdrawal-submissions',
  PreprintWithdrawalSubmissionAttributesJsonApi
> {
  embeds: PreprintWithdrawalSubmissionEmbedsJsonApi;
}

interface PreprintWithdrawalSubmissionMetaJsonApi extends ListMetaJsonApi {
  requests_state_counts: {
    accepted: number;
    pending: number;
    rejected: number;
  };
}

interface PreprintWithdrawalSubmissionAttributesJsonApi {
  comment: string;
  date_last_transitioned: string;
  machine_state: string;
}

interface PreprintWithdrawalSubmissionEmbedsJsonApi {
  creator: UserDataErrorResponseJsonApi;
  target: Embed<JsonApiResource<'preprints', PreprintAttributesJsonApi>>;
}
