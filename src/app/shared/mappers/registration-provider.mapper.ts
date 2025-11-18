import { ProvidersResponseJsonApi } from '../models/provider/providers-json-api.model';
import { RegistryProviderDetailsJsonApi } from '../models/provider/registration-provider-json-api.model';
import { RegistryProviderDetails } from '../models/provider/registry-provider.model';
import { ProviderSchema } from '../models/registration/provider-schema.model';

export class RegistrationProviderMapper {
  static fromProvidersResponse(response: ProvidersResponseJsonApi): ProviderSchema[] {
    return response.data.map((item) => ({
      id: item.id,
      name: item.attributes.name,
    }));
  }

  static fromRegistryProvider(response: RegistryProviderDetailsJsonApi): RegistryProviderDetails {
    const brandRaw = response.embeds?.brand.data;

    return {
      id: response.id,
      name: response.attributes.name,
      descriptionHtml: response.attributes.description,
      permissions: response.attributes.permissions,
      brand: brandRaw
        ? {
            id: brandRaw.id,
            name: brandRaw.attributes.name,
            heroLogoImageUrl: brandRaw.attributes.hero_logo_image,
            heroBackgroundImageUrl: brandRaw.attributes.hero_background_image,
            topNavLogoImageUrl: brandRaw.attributes.topnav_logo_image,
            primaryColor: brandRaw.attributes.primary_color,
            secondaryColor: brandRaw.attributes.secondary_color,
            backgroundColor: brandRaw.attributes.background_color,
          }
        : null,
      iri: response.links.iri,
      reviewsWorkflow: response.attributes.reviews_workflow,
    };
  }
}
