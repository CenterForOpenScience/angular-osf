import { JsonApiResponseWithMeta, MetaJsonApi } from '@osf/shared/models/common/json-api.model';
import { UserDataErrorResponseJsonApi } from '@osf/shared/models/user/user-json-api.model';

export type PreprintSubmissionWithdrawalResponseJsonApi = JsonApiResponseWithMeta<
  PreprintWithdrawalSubmissionDataJsonApi[],
  PreprintWithdrawalSubmissionMetaJsonApi,
  null
>;

export interface PreprintWithdrawalSubmissionDataJsonApi {
  id: string;
  attributes: PreprintWithdrawalSubmissionAttributesJsonApi;
  embeds: PreprintWithdrawalSubmissionEmbedsJsonApi;
}

interface PreprintWithdrawalSubmissionMetaJsonApi extends MetaJsonApi {
  requests_state_counts: {
    pending: number;
    accepted: number;
    rejected: number;
  };
}

interface PreprintWithdrawalSubmissionAttributesJsonApi {
  comment: string;
  machine_state: string;
  date_last_transitioned: string;
}

interface PreprintWithdrawalSubmissionEmbedsJsonApi {
  target: {
    data: {
      id: string;
      attributes: {
        title: string;
      };
    };
  };
  creator: UserDataErrorResponseJsonApi;
}
