import {
  InstitutionUser,
  InstitutionUserDataJsonApi,
  InstitutionUsersJsonApi,
} from '@osf/features/admin-institutions/models';

export function mapInstitutionUsers(jsonApiData: InstitutionUsersJsonApi): InstitutionUser[] {
  return jsonApiData.data.map((user: InstitutionUserDataJsonApi) => ({
    id: user.id,
    userName: user.attributes.user_name,
    department: user.attributes.department,
    orcidId: user.attributes.orcid_id,
    monthLastLogin: user.attributes.month_last_login,
    monthLastActive: user.attributes.month_last_active,
    accountCreationDate: user.attributes.account_creation_date,
    publicProjects: user.attributes.public_projects,
    privateProjects: user.attributes.private_projects,
    publicRegistrationCount: user.attributes.public_registration_count,
    embargoedRegistrationCount: user.attributes.embargoed_registration_count,
    publishedPreprintCount: user.attributes.published_preprint_count,
    publicFileCount: user.attributes.public_file_count,
    storageByteCount: user.attributes.storage_byte_count,
    contactsCount: user.attributes.contacts.length,
    userId: user.relationships.user.data.id,
    userLink: user.relationships.user.links.related.href,
  }));
}
