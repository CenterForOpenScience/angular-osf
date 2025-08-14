import { License } from '@shared/models';

import { ProjectOverview, ProjectOverviewGetResponseJsoApi } from '../models';

export class ProjectOverviewMapper {
  static fromGetProjectResponse(response: ProjectOverviewGetResponseJsoApi): ProjectOverview {
    return {
      id: response.id,
      type: response.type,
      title: response.attributes.title,
      description: response.attributes.description,
      dateModified: response.attributes.date_modified,
      dateCreated: response.attributes.date_created,
      isPublic: response.attributes.public,
      category: response.attributes.category,
      isRegistration: response.attributes.registration,
      isPreprint: response.attributes.preprint,
      isFork: response.attributes.fork,
      isCollection: response.attributes.collection,
      tags: response.attributes.tags,
      accessRequestsEnabled: response.attributes.access_requests_enabled,
      nodeLicense: response.attributes.node_license
        ? {
            copyrightHolders: response.attributes.node_license.copyright_holders,
            year: response.attributes.node_license.year,
          }
        : undefined,
      license: response.embeds.license?.data?.attributes as License,
      doi: response.attributes.doi,
      publicationDoi: response.attributes.publication_doi,
      analyticsKey: response.attributes.analytics_key,
      currentUserCanComment: response.attributes.current_user_can_comment,
      currentUserPermissions: response.attributes.current_user_permissions,
      currentUserIsContributor: response.attributes.current_user_is_contributor,
      currentUserIsContributorOrGroupMember: response.attributes.current_user_is_contributor_or_group_member,
      wikiEnabled: response.attributes.wiki_enabled,
      customCitation: response.attributes.custom_citation,
      subjects: response.attributes.subjects?.map((subjectArray) => subjectArray[0]),
      contributors: response.embeds.bibliographic_contributors.data.map((contributor) => ({
        id: contributor.embeds.users.data.id,
        familyName: contributor.embeds.users.data.attributes.family_name,
        fullName: contributor.embeds.users.data.attributes.full_name,
        givenName: contributor.embeds.users.data.attributes.given_name,
        middleName: contributor.embeds.users.data.attributes.middle_name,
        type: contributor.embeds.users.data.type,
      })),
      affiliatedInstitutions: response.embeds.affiliated_institutions?.data.map((institution) => ({
        id: institution.id,
        type: institution.type,
        logo: institution.attributes.assets.logo,
        description: institution.attributes.description,
        name: institution.attributes.name,
      })),
      identifiers: response.embeds.identifiers?.data.map((identifier) => ({
        id: identifier.id,
        type: identifier.type,
        value: identifier.attributes.value,
        category: identifier.attributes.category,
      })),
      ...(response.embeds.storage?.data &&
        !response.embeds.storage?.errors && {
          storage: {
            id: response.embeds.storage.data.id,
            type: response.embeds.storage.data.type,
            storageUsage: response.embeds.storage.data.attributes.storage_usage ?? '0',
            storageLimitStatus: response.embeds.storage.data.attributes.storage_limit_status,
          },
        }),
      supplements: response.embeds.preprints?.data.map((preprint) => ({
        id: preprint.id,
        type: preprint.type,
        title: preprint.attributes.title,
        dateCreated: preprint.attributes.date_created,
        url: preprint.links.html,
      })),
      region: response.relationships.region?.data,
      forksCount: response.relationships.forks.links.related.meta.count,
      viewOnlyLinksCount: response.relationships.view_only_links.links.related.meta.count,
      links: {
        rootFolder: response.relationships?.files?.links?.related?.href,
        iri: response.links?.iri,
      },
    } as ProjectOverview;
  }
}
