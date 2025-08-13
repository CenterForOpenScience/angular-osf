import { FetchInstitutionsJsonApi, GetGeneralInstitutionsResponse, Institution, InstitutionData } from '@shared/models';

export class GeneralInstitutionMapper {
  static adaptInstitution(data: InstitutionData): Institution {
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
    };
  }

  static adaptInstitutions(response: FetchInstitutionsJsonApi): GetGeneralInstitutionsResponse {
    return {
      data: response.data.map((institution) => this.adaptInstitution(institution)),
      total: response.meta.total,
    };
  }
}
