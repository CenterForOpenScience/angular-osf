import { JsonApiResponse } from '../common';
import { LicenseRecordJsonApi } from '../licenses-json-api.model';

export interface ProjectJsonApi {
  id: string;
  type: string;
  attributes: {
    title: string;
    date_modified: string;
    public: boolean;
    node_license: LicenseRecordJsonApi | null;
    description: string;
    tags: string[];
  };
  relationships: ProjectRelationshipsJsonApi;
}

export interface ProjectsResponseJsonApi extends JsonApiResponse<ProjectJsonApi[], null> {
  data: ProjectJsonApi[];
}

export interface ProjectRelationshipsJsonApi {
  license: {
    data: {
      id: string;
      type: 'licenses';
    };
  };
}
