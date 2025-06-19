import { ProjectOverview, ProjectOverviewContributor } from '@osf/features/project/overview/models';

export class ProjectMetadataMapper {
  static fromMetadataApiResponse(response: Record<string, unknown>): ProjectOverview {
    const attributes = response['attributes'] as Record<string, unknown>;
    const embeds = response['embeds'] as Record<string, unknown>;

    // Map contributors from complex nested structure
    const contributors: ProjectOverviewContributor[] = [];
    if (embeds['contributors']) {
      const contributorsData = (embeds['contributors'] as Record<string, unknown>)['data'] as Record<string, unknown>[];
      contributorsData?.forEach((contributor) => {
        const contributorEmbeds = contributor['embeds'] as Record<string, unknown>;
        const userData = (contributorEmbeds['users'] as Record<string, unknown>)['data'] as Record<string, unknown>;
        const userAttributes = userData['attributes'] as Record<string, unknown>;

        contributors.push({
          id: userData['id'] as string,
          type: userData['type'] as string,
          fullName: userAttributes['full_name'] as string,
          givenName: userAttributes['given_name'] as string,
          familyName: userAttributes['family_name'] as string,
          middleName: '',
        });
      });
    }

    return {
      id: response['id'] as string,
      type: (response['type'] as string) || 'nodes',
      title: attributes['title'] as string,
      description: attributes['description'] as string,
      category: attributes['category'] as string,
      tags: (attributes['tags'] as string[]) || [],
      dateCreated: attributes['date_created'] as string,
      dateModified: attributes['date_modified'] as string,
      isPublic: attributes['public'] as boolean,
      isRegistration: attributes['registration'] as boolean,
      isPreprint: attributes['preprint'] as boolean,
      isFork: attributes['fork'] as boolean,
      isCollection: attributes['collection'] as boolean,
      accessRequestsEnabled: attributes['access_requests_enabled'] as boolean,
      wikiEnabled: attributes['wiki_enabled'] as boolean,
      currentUserCanComment: attributes['current_user_can_comment'] as boolean,
      currentUserPermissions: (attributes['current_user_permissions'] as string[]) || [],
      currentUserIsContributor: attributes['current_user_is_contributor'] as boolean,
      currentUserIsContributorOrGroupMember: attributes['current_user_is_contributor_or_group_member'] as boolean,
      analyticsKey: '',
      contributors: contributors,
      subjects: Array.isArray(attributes['subjects']) ? attributes['subjects'].flat() : attributes['subjects'],
      forksCount: 0,
      viewOnlyLinksCount: 0,
    } as ProjectOverview;
  }
}
