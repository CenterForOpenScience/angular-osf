import { BlockType } from '@osf/shared/enums';

import { ApiData, MetaJsonApi, PaginationLinksJsonApi } from '../common';

export interface SchemaBlocksResponseJsonApi {
  data: SchemaBlockJsonApi[];
  meta: MetaJsonApi;
  links: PaginationLinksJsonApi;
}

export type SchemaBlockJsonApi = ApiData<SchemaBlockAttributesJsonApi, null, null, null>;

interface SchemaBlockAttributesJsonApi {
  block_type: BlockType;
  display_text: string;
  example_text: string;
  help_text: string;
  index: number;
  registration_response_key: string | null;
  required: boolean;
  schema_block_group_key: string;
}
