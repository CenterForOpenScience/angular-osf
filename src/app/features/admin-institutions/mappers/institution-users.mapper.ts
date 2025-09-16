import { InstitutionUser, InstitutionUserDataJsonApi, InstitutionUsersJsonApi } from '../models';

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
    monthLasLogin: user.attributes.month_last_login,
    monthLastActive: user.attributes.month_last_active,
    accountCreationDate: user.attributes.account_creation_date,
    storageByteCount: user.attributes.storage_byte_count,
    reportYearMonth: user.attributes.report_yearmonth,
    publicFileCount: user.attributes.public_file_count,
  }));
}
