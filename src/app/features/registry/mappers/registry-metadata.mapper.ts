import { ProjectOverviewContributor } from '@osf/features/project/overview/models';
import { ReviewPermissionsMapper } from '@osf/shared/mappers';
import { RegistrationReviewStates, RegistryStatus, RevisionReviewStates } from '@shared/enums';
import { License, ProviderDataJsonApi } from '@shared/models';

import {
  BibliographicContributor,
  BibliographicContributorData,
  BibliographicContributorsJsonApi,
} from '../models/registry-metadata.models';
import { RegistryOverview } from '../models/registry-overview.models';

export class RegistryMetadataMapper {
  static fromMetadataApiResponse(response: Record<string, unknown>): RegistryOverview {
    const attributes = response['attributes'] as Record<string, unknown>;
    const embeds = response['embeds'] as Record<string, unknown>;
    const relationships = response['relationships'] as Record<string, unknown>;

    const contributors: ProjectOverviewContributor[] = [];
    if (embeds && embeds['contributors']) {
      const contributorsData = (embeds['contributors'] as Record<string, unknown>)['data'] as Record<string, unknown>[];
      contributorsData?.forEach((contributor) => {
        const contributorEmbeds = contributor['embeds'] as Record<string, unknown>;
        if (contributorEmbeds && contributorEmbeds['users']) {
          const userData = (contributorEmbeds['users'] as Record<string, unknown>)['data'] as Record<string, unknown>;
          const userAttributes = userData['attributes'] as Record<string, unknown>;

          contributors.push({
            id: userData['id'] as string,
            type: userData['type'] as string,
            fullName: userAttributes['full_name'] as string,
            givenName: userAttributes['given_name'] as string,
            familyName: userAttributes['family_name'] as string,
            middleName: (userAttributes['middle_name'] as string) || '',
          });
        }
      });
    }

    let license: License | undefined;
    let licenseUrl: string | undefined;

    if (embeds && embeds['license']) {
      const licenseData = (embeds['license'] as Record<string, unknown>)['data'] as Record<string, unknown>;
      if (licenseData) {
        const licenseAttributes = licenseData['attributes'] as Record<string, unknown>;
        license = {
          id: licenseData['id'] as string,
          name: licenseAttributes['name'] as string,
          text: licenseAttributes['text'] as string,
          url: licenseAttributes['url'] as string,
          requiredFields: (licenseAttributes['required_fields'] as string[]) || [],
        };
      }
    } else if (relationships && relationships['license']) {
      const licenseRelationship = relationships['license'] as Record<string, unknown>;
      if (licenseRelationship['links']) {
        const licenseLinks = licenseRelationship['links'] as Record<string, unknown>;
        if (licenseLinks['related'] && typeof licenseLinks['related'] === 'object') {
          const relatedLinks = licenseLinks['related'] as Record<string, unknown>;
          licenseUrl = relatedLinks['href'] as string;
        }
      }
    }

    let nodeLicense: { copyrightHolders: string[]; year: string } | undefined;
    if (attributes['node_license']) {
      const nodeLicenseData = attributes['node_license'] as Record<string, unknown>;
      nodeLicense = {
        copyrightHolders: (nodeLicenseData['copyright_holders'] as string[]) || [],
        year: (nodeLicenseData['year'] as string) || new Date().getFullYear().toString(),
      };
    }

    return {
      id: response['id'] as string,
      type: (response['type'] as string) || 'registrations',
      title: attributes['title'] as string,
      description: attributes['description'] as string,
      category: attributes['category'] as string,
      tags: (attributes['tags'] as string[]) || [],
      dateCreated: attributes['date_created'] as string,
      dateModified: attributes['date_modified'] as string,
      dateRegistered: attributes['date_registered'] as string,
      registrationType: (attributes['registration_type'] as string) || '',
      doi: (attributes['doi'] as string) || '',
      isPublic: attributes['public'] as boolean,
      isFork: attributes['fork'] as boolean,
      customCitation: (attributes['custom_citation'] as string) || '',
      accessRequestsEnabled: attributes['access_requests_enabled'] as boolean,
      wikiEnabled: attributes['wiki_enabled'] as boolean,
      currentUserCanComment: attributes['current_user_can_comment'] as boolean,
      currentUserPermissions: (attributes['current_user_permissions'] as string[]) || [],
      currentUserIsContributor: attributes['current_user_is_contributor'] as boolean,
      currentUserIsContributorOrGroupMember: attributes['current_user_is_contributor_or_group_member'] as boolean,
      analyticsKey: (attributes['analytics_key'] as string) || '',
      contributors: contributors,
      subjects: Array.isArray(attributes['subjects']) ? attributes['subjects'].flat() : attributes['subjects'],
      license: license,
      nodeLicense: nodeLicense,
      licenseUrl: licenseUrl,
      forksCount: 0,
      citation: '',
      hasData: false,
      hasAnalyticCode: false,
      hasMaterials: false,
      hasPapers: false,
      hasSupplements: false,
      questions: {},
      registrationSchemaLink: '',
      associatedProjectId: '',
      schemaResponses: [],
      status: attributes['status'] as RegistryStatus,
      revisionStatus: attributes['revision_status'] as RevisionReviewStates,
      reviewsState: attributes['reviews_state'] as RegistrationReviewStates,
      links: {
        files: '',
      },
      archiving: attributes['archiving'] as boolean,
      currentUserIsModerator: ReviewPermissionsMapper.fromProviderResponse(
        (embeds['contributors'] as Record<string, unknown>)['data'] as ProviderDataJsonApi
      ),
      embargoEndDate: attributes['embargo_end_date'] as string,
      withdrawn: attributes['withdrawn'] as boolean,
      withdrawalJustification: attributes['withdrawal_justification'] as string | undefined,
      dateWithdrawn: attributes['date_withdrawn'] as string | null,
    } as RegistryOverview;
  }

  static mapBibliographicContributors(response: BibliographicContributorsJsonApi): BibliographicContributor[] {
    return response.data.map((contributor: BibliographicContributorData) => ({
      id: contributor.id,
      index: contributor.attributes.index,
      user: {
        id: contributor.embeds.users.data.id,
        fullName: contributor.embeds.users.data.attributes.full_name,
        profileImage: contributor.embeds.users.data.links.profile_image,
        htmlUrl: contributor.embeds.users.data.links.html,
        iri: contributor.embeds.users.data.links.iri,
      },
    }));
  }
}
