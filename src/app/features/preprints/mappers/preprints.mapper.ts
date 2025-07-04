import { ApiData } from '@core/models';
import { Preprint, PreprintJsonApi, PreprintsRelationshipsJsonApi } from '@osf/features/preprints/models';

export class PreprintsMapper {
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
