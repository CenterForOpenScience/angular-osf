import { Embed } from '@osf/shared/models/common/json-api/embeds.model';
import {
  InstitutionDataJsonApi,
  InstitutionsJsonApiResponse,
} from '@osf/shared/models/institutions/institution-json-api.model';
import { Institution, InstitutionsWithTotalCount } from '@osf/shared/models/institutions/institutions.model';
import { replaceBadEncodedChars } from '@shared/helpers/format-bad-encoding.helper';

export class InstitutionsMapper {
  static fromInstitutionsResponse(
    response: InstitutionsJsonApiResponse | Embed<InstitutionDataJsonApi[]>
  ): Institution[] {
    return response.data.map((data) => this.fromInstitutionData(data));
  }

  static fromInstitutionData(data: InstitutionDataJsonApi): Institution {
    return {
      id: data.id,
      type: data.type,
      name: replaceBadEncodedChars(data.attributes.name),
      description: replaceBadEncodedChars(data.attributes.description),
      iri: data.links.iri,
      rorIri: data.attributes.ror_iri,
      iris: data.attributes.iris,
      assets: data.attributes.assets,
      institutionalRequestAccessEnabled: data.attributes.institutional_request_access_enabled,
      logoPath: data.attributes.logo_path,
      userMetricsUrl: data.relationships?.user_metrics?.links?.related?.href,
      linkToExternalReportsArchive: data.attributes.link_to_external_reports_archive,
      sso_availability: data.attributes.sso_availability,
    };
  }

  static fromResponseWithMeta(response: InstitutionsJsonApiResponse): InstitutionsWithTotalCount {
    return {
      data: this.fromInstitutionsResponse(response),
      total: response.meta.total,
    };
  }
}
