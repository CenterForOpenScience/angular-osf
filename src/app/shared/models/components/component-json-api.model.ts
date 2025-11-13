import { ContributorDataJsonApi } from '../contributors/contributor-response-json-api.model';
import { BaseNodeDataJsonApi } from '../nodes/base-node-data-json-api.model';

export interface ComponentGetResponseJsonApi extends BaseNodeDataJsonApi {
  embeds: {
    bibliographic_contributors: {
      data: ContributorDataJsonApi[];
    };
  };
}
