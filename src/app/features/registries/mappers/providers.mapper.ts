import { RegistryProviderDetails } from '@osf/features/registries/models/registry-provider.model';
import { RegistryProviderDetailsJsonApi } from '@osf/features/registries/models/registry-provider-json-api.model';

import { ProviderSchema, ProvidersResponseJsonApi } from '../models';

export class ProvidersMapper {
  static fromProvidersResponse(response: ProvidersResponseJsonApi): ProviderSchema[] {
    return response.data.map((item) => ({
      id: item.id,
      name: item.attributes.name,
    }));
  }

  static fromRegistryProvider(response: RegistryProviderDetailsJsonApi): RegistryProviderDetails {
    const brandRaw = response.embeds!.brand.data;
    return {
      id: response.id,
      name: response.attributes.name,
      descriptionHtml: response.attributes.description,
      brand: {
        id: brandRaw.id,
        name: brandRaw.attributes.name,
        heroLogoImageUrl: brandRaw.attributes.hero_logo_image,
        heroBackgroundImageUrl: brandRaw.attributes.hero_background_image,
        topNavLogoImageUrl: brandRaw.attributes.topnav_logo_image,
        primaryColor: brandRaw.attributes.primary_color,
        secondaryColor: brandRaw.attributes.secondary_color,
      },
      iri: response.links.iri,
    };
  }
}
