import { RegistryOverview, RegistryOverviewJsonApiData } from '@osf/features/registry/models';

export function MapRegistryOverview(data: RegistryOverviewJsonApiData): RegistryOverview {
  return {
    id: data.id,
    type: data.type,
    isPublic: data.attributes.public,
    forksCount: data?.relationships?.forks?.links?.related?.meta?.count || 0,
    title: data.attributes.title,
    description: data.attributes?.description,
    dateModified: data.attributes?.date_modified,
    dateCreated: data.attributes?.date_created,
    dateRegistered: data.attributes?.date_registered,
    category: data.attributes?.category,
    isFork: data.attributes?.fork,
    accessRequestsEnabled: data.attributes?.accessRequestsEnabled,
    nodeLicense: data.attributes.node_license
      ? {
          copyrightHolders: data.attributes.node_license.copyright_holders,
          year: data.attributes.node_license.year,
        }
      : undefined,
    license: data.embeds.license?.data?.attributes,
    registrationType: data.attributes?.registration_supplement,
    doi: data.attributes?.doi,
    tags: data.attributes?.tags,
    contributors: data.embeds?.bibliographic_contributors?.data.map((contributor) => ({
      id: contributor?.embeds?.users?.data?.id,
      familyName: contributor?.embeds?.users?.data?.attributes?.family_name,
      fullName: contributor?.embeds?.users?.data?.attributes?.full_name,
      givenName: contributor?.embeds?.users?.data?.attributes?.given_name,
      middleName: contributor?.embeds?.users?.data?.attributes?.middle_names,
      type: contributor?.embeds?.users?.data?.type,
    })),
    identifiers: data.embeds.identifiers?.data.map((identifier) => ({
      id: identifier.id,
      type: identifier.type,
      value: identifier.attributes.value,
      category: identifier.attributes.category,
    })),
    analyticsKey: data.attributes?.analyticsKey,
    currentUserCanComment: data.attributes.current_user_can_comment,
    currentUserPermissions: data.attributes.current_user_permissions,
    currentUserIsContributor: data.attributes.current_user_is_contributor,
    currentUserIsContributorOrGroupMember: data.attributes.current_user_is_contributor_or_group_member,
    citation: data.relationships?.citation?.data?.id,
    wikiEnabled: data.attributes.wikiEnabled,
    region: data.relationships.region?.data,
    hasData: data.attributes.has_data,
    hasAnalyticCode: data.attributes.has_analytic_code,
    hasMaterials: data.attributes.has_materials,
    hasPapers: data.attributes.has_papers,
    hasSupplements: data.attributes.has_supplements,
    questions: data.attributes.registration_responses,
    registrationSchemaLink: data.relationships.registration_schema.links.related.href,
    associatedProjectId: data.relationships?.registered_from?.data?.id,
  } as RegistryOverview;
}
