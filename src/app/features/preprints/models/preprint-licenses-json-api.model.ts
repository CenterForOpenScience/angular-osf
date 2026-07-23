import { ToOneRelData } from '@osf/shared/models/common/json-api/relationships.model';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { DataResponse } from '@osf/shared/models/common/json-api/responses.model';
import { LicenseRecordJsonApi } from '@osf/shared/models/license/licenses-json-api.model';

export type PreprintLicensePayloadJsonApi = DataResponse<PreprintLicenseDataJsonApi>;

interface PreprintLicenseDataJsonApi extends JsonApiResource<'preprints', PreprintLicenseAttributesJsonApi> {
  relationships: PreprintLicenseRelationshipsJsonApi;
}

interface PreprintLicenseAttributesJsonApi {
  license_record?: LicenseRecordJsonApi;
}

interface PreprintLicenseRelationshipsJsonApi {
  license: ToOneRelData<'licenses'>;
}
