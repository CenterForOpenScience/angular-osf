import { BlockType } from '@osf/shared/enums/block-type.enum';

import { JsonApiResource } from '../common/json-api/resource.model';
import { ListResponse } from '../common/json-api/responses.model';

export type SchemaBlocksResponseJsonApi = ListResponse<SchemaBlockJsonApi>;

type SchemaBlockJsonApi = JsonApiResource<'schema-blocks', SchemaBlockAttributesJsonApi>;

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
