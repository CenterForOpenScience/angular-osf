import {
  InstitutionUser,
  InstitutionUserDataJsonApi,
  InstitutionUsersJsonApi,
} from '@osf/features/admin-institutions/models';

export function mapInstitutionUsers(jsonApiData: InstitutionUsersJsonApi): InstitutionUser[] {
  return jsonApiData.data.map((user: InstitutionUserDataJsonApi) => ({
    id: user.id,
    userId: user.relationships.user.data.id,
    userName: user.attributes.user_name,
    department: user.attributes.department,
    orcidId: user.attributes.orcid_id,
    publicProjects: user.attributes.public_projects,
    privateProjects: user.attributes.private_projects,
    publicRegistrationCount: user.attributes.public_registration_count,
    embargoedRegistrationCount: user.attributes.embargoed_registration_count,
    publishedPreprintCount: user.attributes.published_preprint_count,
  }));
}
