import { LicenseRecordJsonApi } from '@osf/shared/models/license/licenses-json-api.model';

export interface PreprintLicenseRelationshipJsonApi {
  id: string;
  type: 'licenses';
}

export interface PreprintLicensePayloadJsonApi {
  data: {
    type: 'preprints';
    id: string;
    relationships: {
      license: {
        data: PreprintLicenseRelationshipJsonApi;
      };
    };
    attributes: {
      license_record?: LicenseRecordJsonApi;
    };
  };
}
