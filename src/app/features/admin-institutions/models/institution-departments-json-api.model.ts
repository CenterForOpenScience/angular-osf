export interface InstitutionDepartmentAttributesJsonApi {
  name: string;
  number_of_users: number;
}

export interface InstitutionDepartmentLinksJsonApi {
  self: string;
}

export interface InstitutionDepartmentDataJsonApi {
  id: string;
  type: 'institution-departments';
  attributes: InstitutionDepartmentAttributesJsonApi;
  links: InstitutionDepartmentLinksJsonApi;
}

export interface InstitutionDepartmentsJsonApi {
  data: InstitutionDepartmentDataJsonApi[];
}
