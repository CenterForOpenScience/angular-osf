import { JsonApiResponseWithMeta, MetaJsonApi } from '@osf/core/models';

export type PreprintSubmissionResponseJsonApi = JsonApiResponseWithMeta<
  PreprintSubmissionDataJsonApi[],
  PreprintSubmissionMetaJsonApi,
  null
>;

export interface PreprintSubmissionDataJsonApi {
  id: string;
  attributes: PreprintSubmissionAttributesJsonApi;
}

interface PreprintSubmissionMetaJsonApi extends MetaJsonApi {
  reviews_state_counts: {
    pending: number;
    accepted: number;
    rejected: number;
    withdrawn: number;
  };
}

interface PreprintSubmissionAttributesJsonApi {
  id: string;
  title: string;
  reviews_state: string;
  public: boolean;
  embargoed: boolean;
  embargo_end_date: string;
}
