import { Embed, EmbedList } from '../common/json-api/embeds.model';
import { ContributorDataJsonApi } from '../contributors/contributor-response-json-api.model';
import { IdentifiersJsonApiData } from '../identifiers/identifier-json-api.model';
import { InstitutionDataJsonApi } from '../institutions/institution-json-api.model';
import { LicenseDataJsonApi } from '../license/licenses-json-api.model';
import { RegionDataJsonApi } from '../regions/regions.json-api.model';
import { WikiDataJsonApi } from '../wiki/wiki-json-api.model';

import { BaseNodeDataJsonApi } from './base-node-data-json-api.model';

export interface BaseNodeEmbedsJsonApi {
  affiliated_institutions?: EmbedList<InstitutionDataJsonApi>;
  bibliographic_contributors?: EmbedList<ContributorDataJsonApi>;
  identifiers?: EmbedList<IdentifiersJsonApiData>;
  license?: Embed<LicenseDataJsonApi>;
  region?: Embed<RegionDataJsonApi>;
  parent?: Embed<BaseNodeDataJsonApi>;
  wikis?: EmbedList<WikiDataJsonApi>;
}
