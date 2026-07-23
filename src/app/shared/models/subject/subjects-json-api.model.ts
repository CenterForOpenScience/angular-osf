import { Embed } from '../common/json-api/embeds.model';
import { ResourceLinksJsonApi } from '../common/json-api/links.model';
import { RelatedCountRel, ToOneRel } from '../common/json-api/relationships.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { ListResponse } from '../common/json-api/responses.model';

export type SubjectsResponseJsonApi = ListResponse<SubjectDataJsonApi>;

export interface SubjectDataJsonApi extends JsonApiResource<string, SubjectAttributesJsonApi> {
  relationships: SubjectRelationshipsJsonApi;
  embeds?: SubjectEmbedsJsonApi;
  links: ResourceLinksJsonApi;
}

interface SubjectAttributesJsonApi {
  taxonomy_name: string;
  text: string;
}

interface SubjectRelationshipsJsonApi {
  children: RelatedCountRel;
  parent?: ToOneRel<'subjects'>;
}

interface SubjectEmbedsJsonApi {
  parent?: Embed<SubjectDataJsonApi>;
}
