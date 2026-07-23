import { ListMetaJsonApi } from '@osf/shared/models/common/json-api/meta.model';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ListResponse } from '@osf/shared/models/common/json-api/responses.model';

export type PreprintSubmissionResponseJsonApi = ListResponse<PreprintSubmissionDataJsonApi> & {
  meta: PreprintSubmissionMetaJsonApi;
};

export type PreprintSubmissionDataJsonApi = JsonApiResource<'preprints', PreprintSubmissionAttributesJsonApi>;

interface PreprintSubmissionMetaJsonApi extends ListMetaJsonApi {
  reviews_state_counts: {
    accepted: number;
    pending: number;
    rejected: number;
    withdrawn: number;
  };
}

interface PreprintSubmissionAttributesJsonApi {
  embargo_end_date: string;
  embargoed: boolean;
  id: string;
  public: boolean;
  reviews_state: string;
  title: string;
}
