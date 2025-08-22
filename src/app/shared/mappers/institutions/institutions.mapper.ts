import {
  Institution,
  InstitutionDataJsonApi,
  InstitutionsJsonApiResponse,
  InstitutionsWithMetaJsonApiResponse,
  InstitutionsWithTotalCount,
} from '@shared/models';

export class InstitutionsMapper {
  static fromInstitutionsResponse(response: InstitutionsJsonApiResponse): Institution[] {
    return response.data.map((data) => this.fromInstitutionData(data));
  }

  static fromInstitutionData(data: InstitutionDataJsonApi): Institution {
    return {
      id: data.id,
      type: data.type,
      name: data.attributes.name,
      description: data.attributes.description,
      iri: data.attributes.iri,
      rorIri: data.attributes.ror_iri,
      iris: data.attributes.iris,
      assets: data.attributes.assets,
      institutionalRequestAccessEnabled: data.attributes.institutional_request_access_enabled,
      logoPath: data.attributes.logo_path,
      userMetricsUrl: data.relationships?.user_metrics?.links?.related?.href,
      linkToExternalReportsArchive: data.attributes.link_to_external_reports_archive,
    };
  }

  static fromResponseWithMeta(response: InstitutionsWithMetaJsonApiResponse): InstitutionsWithTotalCount {
    return {
      data: this.fromInstitutionsResponse(response),
      total: response.meta.total,
    };
  }
}
