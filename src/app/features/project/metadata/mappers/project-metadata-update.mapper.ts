import { ProjectOverview } from '@osf/features/project/overview/models';

export class ProjectMetadataUpdateMapper {
  static fromMetadataApiResponse(response: Record<string, unknown>): ProjectOverview {
    const id = response['id'] as string;
    const type = (response['type'] as string) || 'nodes';
    const attributes = (response['attributes'] as Record<string, unknown>) || {};

    return {
      id,
      type,
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
      subjects: Array.isArray(attributes['subjects']) ? attributes['subjects'].flat() : attributes['subjects'],
      forksCount: 0,
      viewOnlyLinksCount: 0,
    } as ProjectOverview;
  }
}
