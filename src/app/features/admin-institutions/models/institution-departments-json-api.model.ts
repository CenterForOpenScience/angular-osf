import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ListResponse } from '@osf/shared/models/common/json-api/responses.model';

export type InstitutionDepartmentsJsonApi = ListResponse<InstitutionDepartmentDataJsonApi>;

export type InstitutionDepartmentDataJsonApi = JsonApiResource<
  'institution-departments',
  InstitutionDepartmentAttributesJsonApi
>;

interface InstitutionDepartmentAttributesJsonApi {
  name: string;
  number_of_users: number;
}
