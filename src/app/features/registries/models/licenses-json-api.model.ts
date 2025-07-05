import { LicenseRecordJsonApi } from '@shared/models';

export interface LicenseRelationshipJsonApi {
  license: {
    data: {
      id: string;
      type: 'licenses';
    };
  };
}

export interface LicensePayloadJsonApi {
  data: {
    type: 'draft_registrations';
    id: string;
    relationships: LicenseRelationshipJsonApi;
    attributes: {
      node_license?: LicenseRecordJsonApi;
    };
  };
}
