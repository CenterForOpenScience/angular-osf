import { RegistryOverview, RegistryOverviewData } from '@osf/features/registry/models';

export function MapRegistryOverview(data: RegistryOverviewData): RegistryOverview {
  return {
    id: data.id,
    isPublic: data.attributes.public,
    forksCount: data?.relationships?.forks?.links?.related?.meta?.count,
    title: data.attributes.title,
    description: data.attributes?.description,
    dateModified: data.attributes?.date_modified,
    dateCreated: data.attributes?.date_created,
    registrationType: data.attributes?.registration_supplement,
    associatedProject: data.relationships?.registered_form?.data?.id,
    doi: data.attributes?.doi,
    tags: data.attributes?.tags,
    contributors: data.embeds.bibliographic_contributors.data.map((contributor) => ({
      id: contributor.embeds.users.data.id,
      familyName: contributor.embeds.users.data.attributes.family_name,
      fullName: contributor.embeds.users.data.attributes.full_name,
      givenName: contributor.embeds.users.data.attributes.given_name,
      middleName: contributor.embeds.users.data.attributes.middle_names,
      type: contributor.embeds.users.data.type,
    })),
    citation: data.relationships.citation.data.id,
  } as RegistryOverview;
}
