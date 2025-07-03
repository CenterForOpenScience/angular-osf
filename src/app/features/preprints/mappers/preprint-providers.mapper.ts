import {
  PreprintProviderDetails,
  PreprintProviderDetailsJsonApi,
  PreprintProviderShortInfo,
} from '@osf/features/preprints/models';
import { Subject, SubjectDataJsonApi } from '@shared/models';

export class PreprintProvidersMapper {
  static fromPreprintProviderDetailsGetResponse(response: PreprintProviderDetailsJsonApi): PreprintProviderDetails {
    const brandRaw = response.embeds!.brand.data;
    return {
      id: response.id,
      name: response.attributes.name,
      descriptionHtml: response.attributes.description,
      advisoryBoardHtml: response.attributes.advisory_board,
      examplePreprintId: response.attributes.example,
      domain: response.attributes.domain,
      footerLinksHtml: response.attributes.footer_links,
      preprintWord: response.attributes.preprint_word,
      allowSubmissions: response.attributes.allow_submissions,
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
      faviconUrl: response.attributes.assets.favicon,
    };
  }

  static toPreprintProviderShortInfoFromGetResponse(
    response: PreprintProviderDetailsJsonApi[]
  ): PreprintProviderShortInfo[] {
    return response.map((item) => ({
      id: item.id,
      descriptionHtml: item.attributes.description,
      name: item.attributes.name,
      whiteWideImageUrl: item.attributes.assets?.wide_white,
      squareColorNoTransparentImageUrl: item.attributes.assets?.square_color_no_transparent,
    }));
  }

  static fromSubjectsGetResponse(data: SubjectDataJsonApi[]): Subject[] {
    return data.map((subject) => ({
      id: subject.id,
      name: subject.attributes.text,
      iri: subject.links.iri,
    }));
  }
}
