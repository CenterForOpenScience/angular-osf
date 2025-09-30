import { ContributorsMapper, IdentifiersMapper, LicensesMapper } from '@osf/shared/mappers';
import { MapRegistryStatus, RegistrationMapper, RegistrationNodeMapper } from '@osf/shared/mappers/registration';

import { RegistryOverview, RegistryOverviewJsonApiData } from '../models';

export function MapRegistryOverview(data: RegistryOverviewJsonApiData): RegistryOverview | null {
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
    customCitation: data.attributes?.custom_citation,
    isFork: data.attributes?.fork,
    accessRequestsEnabled: data.attributes?.access_requests_enabled,
    nodeLicense: data.attributes.node_license
      ? {
          copyrightHolders: data.attributes.node_license.copyright_holders,
          year: data.attributes.node_license.year,
        }
      : undefined,
    registrationType: data.attributes?.registration_supplement,
    doi: data.attributes?.article_doi,
    tags: data.attributes?.tags,
    contributors: ContributorsMapper.getContributors(data?.embeds?.bibliographic_contributors?.data),
    identifiers: IdentifiersMapper.fromJsonApi(data.embeds?.identifiers),
    analyticsKey: data.attributes?.analytics_key,
    currentUserCanComment: data.attributes.current_user_can_comment,
    currentUserPermissions: data.attributes.current_user_permissions,
    currentUserIsContributor: data.attributes.current_user_is_contributor,
    currentUserIsContributorOrGroupMember: data.attributes.current_user_is_contributor_or_group_member,
    citation: data.relationships?.citation?.data?.id,
    wikiEnabled: data.attributes.wiki_enabled,
    region: data.relationships.region?.data,
    hasData: data.attributes.has_data,
    hasAnalyticCode: data.attributes.has_analytic_code,
    hasMaterials: data.attributes.has_materials,
    hasPapers: data.attributes.has_papers,
    hasSupplements: data.attributes.has_supplements,
    iaUrl: data.attributes.ia_url,
    license: LicensesMapper.fromLicenseDataJsonApi(data.embeds?.license?.data),
    registrationSchemaLink: data.relationships.registration_schema.links.related.href,
    associatedProjectId: data.relationships?.registered_from?.data?.id,
    schemaResponses: data.embeds?.schema_responses?.data?.map((item) => RegistrationMapper.fromSchemaResponse(item)),
    provider: RegistrationNodeMapper.getRegistrationProviderShortInfo(data.embeds?.provider?.data),
    status: MapRegistryStatus(data.attributes),
    revisionStatus: data.attributes.revision_state,
    reviewsState: data.attributes.reviews_state,
    archiving: data.attributes.archiving,
    withdrawn: data.attributes.withdrawn || false,
    withdrawalJustification: data.attributes.withdrawal_justification,
    dateWithdrawn: data.attributes.date_withdrawn || null,
    embargoEndDate: data.attributes.embargo_end_date || null,
    rootParentId: data.relationships.root?.data?.id,
  } as RegistryOverview;
}

export function MapRegistrationOverview(data: RegistryOverviewJsonApiData) {
  const registrationAttributes = RegistrationNodeMapper.getRegistrationNodeAttributes(data.id, data.attributes);
  const providerInfo = RegistrationNodeMapper.getRegistrationProviderShortInfo(data.embeds?.provider?.data);
  const identifiers = IdentifiersMapper.fromJsonApi(data.embeds?.identifiers);
  const license = LicensesMapper.fromLicenseDataJsonApi(data.embeds?.license?.data);

  return {
    ...registrationAttributes,
    provider: providerInfo,
    identifiers: identifiers,
    license: license,
  };
}
