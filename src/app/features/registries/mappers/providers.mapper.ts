import { ProviderSchema, ProvidersResponseJsonApi } from '../models';

export class ProvidersMapper {
  static fromProvidersResponse(response: ProvidersResponseJsonApi): ProviderSchema[] {
    return response.data.map((item) => ({
      id: item.id,
      name: item.attributes.name,
    }));
  }
}
