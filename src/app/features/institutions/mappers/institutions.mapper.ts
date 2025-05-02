import {
  Institution,
  UserInstitutionGetResponse,
} from '../entities/institutions.models';

export class InstitutionsMapper {
  static fromResponse(response: UserInstitutionGetResponse): Institution {
    return {
      id: response.id,
      type: response.type,
      name: response.attributes.name,
      description: response.attributes.description,
      iri: response.attributes.iri,
      rorIri: response.attributes.ror_iri,
      iris: response.attributes.iris,
      assets: response.attributes.assets,
      institutionalRequestAccessEnabled:
        response.attributes.institutional_request_access_enabled,
      logoPath: response.attributes.logo_path,
    };
  }
}
