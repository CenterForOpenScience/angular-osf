import { RegistrationResponseJsonApi } from '../models';
import { Registration } from '../models/registration.model';

export class RegistrationMapper {
  static fromRegistrationResponse(response: RegistrationResponseJsonApi): Registration {
    return {
      id: response.data.id,
      title: response.data.attributes.title,
      description: response.data.attributes.description,
      registrationSchemaId: response.data.relationships.registration_schema?.data?.id || '',
      license: {
        id: response.data.relationships.license?.data?.id || '',
        options: response.data.attributes.node_license,
      },
    };
  }
}
