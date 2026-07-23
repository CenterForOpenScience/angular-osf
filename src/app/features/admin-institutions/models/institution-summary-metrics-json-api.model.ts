import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ItemResponse } from '@osf/shared/models/common/json-api/responses.model';

export type InstitutionSummaryMetricsJsonApi = ItemResponse<InstitutionSummaryMetricsDataJsonApi>;

export type InstitutionSummaryMetricsDataJsonApi = JsonApiResource<
  'institution-summary-metrics',
  InstitutionSummaryMetricsAttributesJsonApi
>;

export interface InstitutionSummaryMetricsAttributesJsonApi {
  report_yearmonth: string;
  user_count: number;
  public_project_count: number;
  private_project_count: number;
  public_registration_count: number;
  embargoed_registration_count: number;
  published_preprint_count: number;
  public_file_count: number;
  storage_byte_count: number;
  monthly_logged_in_user_count: number;
  monthly_active_user_count: number;
}
