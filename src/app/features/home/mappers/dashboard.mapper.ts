import { Project } from '@osf/features/home/models/project.entity';
import { ProjectItem } from '@osf/features/home/models/raw-models/ProjectItem.entity';
import { BibliographicContributor } from '@osf/features/home/models/bibliographic-contributor.entity';

export function mapProjectUStoProject(dataItem: ProjectItem): Project {
  const contributors: BibliographicContributor[] = [];

  for (const item of dataItem.embeds.bibliographic_contributors.data) {
    contributors.push({
      bibliographic: item.attributes.bibliographic,
      id: item.id,
      index: item.attributes.index,
      permission: item.attributes.permission,
      unregisteredContributor: item.attributes.unregistered_contributor,
      users: {
        id: item.embeds.users.data.id,
        familyName: item.embeds.users.data.attributes.family_name,
        fullName: item.embeds.users.data.attributes.full_name,
        givenName: item.embeds.users.data.attributes.given_name,
        locale: item.embeds.users.data.attributes.locale,
        timezone: item.embeds.users.data.attributes.timezone,
      },
    } as BibliographicContributor);
  }

  return {
    id: dataItem.id,
    title: dataItem.attributes.title,
    description: dataItem.attributes.description,
    category: dataItem.attributes.category,
    dateCreated: new Date(dataItem.attributes.date_created),
    dateModified: new Date(dataItem.attributes.date_created),
    fork: dataItem.attributes.fork,
    tags: dataItem.attributes.tags,
    currentUserPermissions: dataItem.attributes.current_user_permissions,
    currentUserIsContributor: dataItem.attributes.current_user_is_contributor,
    currentUserIsContributorOrGroupMember:
      dataItem.attributes.current_user_is_contributor_or_group_member,
    public: dataItem.attributes.public,
    bibliographicContributors: contributors,
  };
}
