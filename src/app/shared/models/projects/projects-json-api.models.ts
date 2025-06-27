import { JsonApiResponse } from '@core/models';

export interface ProjectGetResponseJsonApi {
  id: string;
  type: string;
  attributes: {
    title: string;
    date_modified: string;
    public: boolean;
    node_license: string | null;
    description: string;
    tags: string[];
  };
}

export interface ProjectsGetResponseJsonApi extends JsonApiResponse<ProjectGetResponseJsonApi[], null> {
  data: ProjectGetResponseJsonApi[];
}
