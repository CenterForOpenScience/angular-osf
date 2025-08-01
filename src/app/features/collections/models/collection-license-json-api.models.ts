import { LicenseRecordJsonApi } from '@shared/models';

export interface CollectionSubmissionMetadataPayloadJsonApi {
  data: {
    type: 'nodes';
    id: string;
    relationships: {
      license: {
        data: {
          id: string;
          type: string;
        };
      };
    };
    attributes: {
      node_license?: LicenseRecordJsonApi;
      title?: string;
      description?: string;
      tags?: string[];
    };
  };
}
