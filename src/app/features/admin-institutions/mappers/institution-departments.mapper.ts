import { InstitutionDepartment, InstitutionDepartmentDataJsonApi, InstitutionDepartmentsJsonApi } from '../models';

export function mapInstitutionDepartments(jsonApiData: InstitutionDepartmentsJsonApi): InstitutionDepartment[] {
  return jsonApiData.data.map((department: InstitutionDepartmentDataJsonApi) => ({
    id: department.id,
    name: department.attributes.name,
    numberOfUsers: department.attributes.number_of_users,
  }));
}

export function mapInstitutionDepartment(department: InstitutionDepartmentDataJsonApi): InstitutionDepartment {
  return {
    id: department.id,
    name: department.attributes.name,
    numberOfUsers: department.attributes.number_of_users,
  };
}
