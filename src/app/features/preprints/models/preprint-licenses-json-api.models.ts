import { LicenseRecordJsonApi } from '@shared/models';

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
