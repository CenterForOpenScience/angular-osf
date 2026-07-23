import { JsonApiResource, JsonApiResourceRef } from '../common/json-api/resource.model';

export interface ContributorAddRequestModel extends Omit<
  JsonApiResource<'contributors', ContributorAddRequestAttributesModel>,
  'id'
> {
  id?: string;
  relationships?: ContributorAddRequestRelationshipsModel;
}

interface ContributorAddRequestAttributesModel {
  bibliographic: boolean;
  child_nodes?: string[];
  email?: string;
  full_name?: string;
  id?: string;
  index?: number;
  permission: string;
}

interface ContributorAddRequestRelationshipsModel {
  users?: {
    data: Partial<JsonApiResourceRef<'users'>>;
  };
}
