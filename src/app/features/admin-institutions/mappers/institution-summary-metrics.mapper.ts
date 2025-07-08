import {
  InstitutionSummaryMetrics,
  InstitutionSummaryMetricsAttributesJsonApi,
} from '@osf/features/admin-institutions/models';

export function mapInstitutionSummaryMetrics(
  attributes: InstitutionSummaryMetricsAttributesJsonApi
): InstitutionSummaryMetrics {
  return {
    reportYearmonth: attributes.report_yearmonth,
    userCount: attributes.user_count,
    publicProjectCount: attributes.public_project_count,
    privateProjectCount: attributes.private_project_count,
    publicRegistrationCount: attributes.public_registration_count,
    embargoedRegistrationCount: attributes.embargoed_registration_count,
    publishedPreprintCount: attributes.published_preprint_count,
    publicFileCount: attributes.public_file_count,
    storageByteCount: attributes.storage_byte_count,
    monthlyLoggedInUserCount: attributes.monthly_logged_in_user_count,
    monthlyActiveUserCount: attributes.monthly_active_user_count,
  };
}
