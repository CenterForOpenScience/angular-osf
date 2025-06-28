import { RegistrationDataJsonApi } from '../models';
import { Registration } from '../models/registration.model';

export class RegistrationMapper {
  static fromRegistrationResponse(response: RegistrationDataJsonApi): Registration {
    console.log('RegistrationMapper.fromRegistrationResponse', response);
    return {
      id: response.id,
      title: response.attributes.title,
      description: response.attributes.description,
      registrationSchemaId: response.relationships.registration_schema?.data?.id || '',
    };
  }
}
