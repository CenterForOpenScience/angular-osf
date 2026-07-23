import { ToOneRelData } from '@osf/shared/models/common/json-api/relationships.model';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { DataResponse } from '@osf/shared/models/common/json-api/responses.model';
import { LicenseRecordJsonApi } from '@osf/shared/models/license/licenses-json-api.model';

export type CollectionSubmissionMetadataPayloadJsonApi = DataResponse<CollectionSubmissionMetadataDataJsonApi>;

interface CollectionSubmissionMetadataDataJsonApi extends JsonApiResource<
  'nodes',
  CollectionSubmissionMetadataAttributesJsonApi
> {
  relationships: CollectionSubmissionMetadataRelationshipsJsonApi;
}

interface CollectionSubmissionMetadataAttributesJsonApi {
  node_license?: LicenseRecordJsonApi;
  title?: string;
  description?: string;
  tags?: string[];
}

interface CollectionSubmissionMetadataRelationshipsJsonApi {
  license: ToOneRelData<'licenses'>;
}
