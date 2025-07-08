import {
  InstitutionDepartment,
  InstitutionDepartmentDataJsonApi,
  InstitutionDepartmentsJsonApi,
} from '@osf/features/admin-institutions/models';

export function mapInstitutionDepartments(jsonApiData: InstitutionDepartmentsJsonApi): InstitutionDepartment[] {
  return jsonApiData.data.map((department: InstitutionDepartmentDataJsonApi) => ({
    id: department.id,
    name: department.attributes.name,
    numberOfUsers: department.attributes.number_of_users,
    selfLink: department.links.self,
  }));
}

export function mapInstitutionDepartment(department: InstitutionDepartmentDataJsonApi): InstitutionDepartment {
  return {
    id: department.id,
    name: department.attributes.name,
    numberOfUsers: department.attributes.number_of_users,
    selfLink: department.links.self,
  };
}
