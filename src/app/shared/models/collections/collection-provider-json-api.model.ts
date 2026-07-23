import { CedarMetadataDataTemplateJsonApi } from '@osf/features/metadata/models/cedar-metadata-template.model';

import { BrandDataJsonApi } from '../brand/brand.json-api.model';
import { Embed } from '../common/json-api/embeds.model';
import { ResourceLinksJsonApi } from '../common/json-api/links.model';
import { ToOneRel } from '../common/json-api/relationships.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { ItemResponse } from '../common/json-api/responses.model';
import { CollectionsProviderAttributesJsonApi } from '../provider/collections-provider-json-api.model';

export type CollectionProviderGetResponseJsonApi = ItemResponse<CollectionProviderDataJsonApi>;

export interface CollectionProviderDataJsonApi extends JsonApiResource<
  'collection-providers',
  CollectionsProviderAttributesJsonApi
> {
  embeds: CollectionProviderEmbedsJsonApi;
  relationships: CollectionProviderRelationshipsJsonApi;
  links?: Pick<ResourceLinksJsonApi, 'iri'>;
}

interface CollectionProviderEmbedsJsonApi {
  brand: Embed<BrandDataJsonApi>;
  required_metadata_template: Embed<CedarMetadataDataTemplateJsonApi>;
}

interface CollectionProviderRelationshipsJsonApi {
  primary_collection: ToOneRel<'collections'>;
}
