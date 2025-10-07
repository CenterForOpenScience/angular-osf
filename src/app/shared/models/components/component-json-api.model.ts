import { ContributorDataJsonApi } from '../contributors';
import { BaseNodeDataJsonApi } from '../nodes';

export interface ComponentGetResponseJsonApi extends BaseNodeDataJsonApi {
  embeds: {
    bibliographic_contributors: {
      data: ContributorDataJsonApi[];
    };
  };
}
