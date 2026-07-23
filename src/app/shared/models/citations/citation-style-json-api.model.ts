import { JsonApiResource } from '../common/json-api/resource.model';
import { ListResponse } from '../common/json-api/responses.model';

export type CitationStyleResponseJsonApi = ListResponse<CitationStyleDataJsonApi>;

export type CitationStyleDataJsonApi = JsonApiResource<'citation-styles', CitationStyleAttributesJsonApi>;

interface CitationStyleAttributesJsonApi {
  title: string;
  short_title: string | null;
  summary: string | null;
  date_parsed: string;
}
