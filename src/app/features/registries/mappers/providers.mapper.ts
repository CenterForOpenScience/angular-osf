import { Provider, ProvidersResponseJsonApi } from '../models';

export class ProvidersMapper {
  static fromProvidersResponse(response: ProvidersResponseJsonApi): Provider[] {
    return response.data.map((item) => ({
      id: item.id,
      name: item.attributes.name,
    }));
  }
}
