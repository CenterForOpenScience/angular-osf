import { ApiData } from '@core/models';
import {
  Preprint,
  PreprintJsonApi,
  PreprintProviderDetails,
  PreprintProviderDetailsGetResponse,
  PreprintProviderShortInfo,
  PreprintsRelationshipsJsonApi,
  Subject,
  SubjectGetResponse,
} from '@osf/features/preprints/models';

export class PreprintsMapper {
  static fromPreprintProviderDetailsGetResponse(response: PreprintProviderDetailsGetResponse): PreprintProviderDetails {
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
    response: PreprintProviderDetailsGetResponse[]
  ): PreprintProviderShortInfo[] {
    return response.map((item) => ({
      id: item.id,
      descriptionHtml: item.attributes.description,
      name: item.attributes.name,
      whiteWideImageUrl: item.attributes.assets?.wide_white,
      squareColorNoTransparentImageUrl: item.attributes.assets?.square_color_no_transparent,
    }));
  }

  static fromSubjectsGetResponse(providerId: string, response: SubjectGetResponse[]): Subject[] {
    return response.map((subject) => ({
      id: subject.id,
      text: subject.attributes.text,
      taxonomy_name: subject.attributes.taxonomy_name,
      preprintProviderId: providerId,
    }));
  }

  static toCreatePayload(title: string, abstract: string, providerId: string) {
    return {
      data: {
        attributes: {
          title: title,
          description: abstract,
        },
        relationships: {
          provider: {
            data: {
              id: providerId,
              type: 'preprint-provider',
            },
          },
        },
        type: 'preprints',
      },
    };
  }

  static fromPreprintJsonApi(response: ApiData<PreprintJsonApi, null, PreprintsRelationshipsJsonApi, null>): Preprint {
    return {
      id: response.id,
      dateCreated: response.attributes.date_created,
      dateModified: response.attributes.date_modified,
      title: response.attributes.title,
      description: response.attributes.description,
      doi: response.attributes.doi,
      customPublicationCitation: response.attributes.custom_publication_citation,
      originalPublicationDate: response.attributes.original_publication_date,
      isPublished: response.attributes.is_published,
      tags: response.attributes.tags,
      isPublic: response.attributes.public,
      version: response.attributes.version,
      isLatestVersion: response.attributes.is_latest_version,
      primaryFileId: response.relationships.primary_file?.links?.related?.href || null,
      licenseId: response.relationships.license?.data?.id || null,
      licenseOptions: response.attributes.license_record
        ? {
            year: response.attributes.license_record.year,
            copyrightHolders: response.attributes.license_record.copyright_holders.join(','),
          }
        : null,
    };
  }
}
