import { ProjectOverview } from '@osf/features/project/overview/models';

import { ContributorModel } from '../models/contributors/contributor.model';
import { ResourceOverview } from '../models/resource-overview.model';
import { SubjectModel } from '../models/subject/subject.model';

export function MapProjectOverview(
  project: ProjectOverview,
  subjects: SubjectModel[],
  isAnonymous = false,
  bibliographicContributors: ContributorModel[] = []
): ResourceOverview {
  return {
    id: project.id,
    type: project.type,
    title: project.title,
    description: project.description,
    dateModified: project.dateModified,
    dateCreated: project.dateCreated,
    isPublic: project.isPublic,
    category: project.category,
    isRegistration: project.isRegistration,
    isPreprint: project.isPreprint,
    isFork: project.isFork,
    isCollection: project.isCollection,
    tags: project.tags || [],
    accessRequestsEnabled: project.accessRequestsEnabled,
    nodeLicense: project.nodeLicense,
    license: project.license || undefined,
    storage: project.storage || undefined,
    identifiers: project.identifiers?.filter(Boolean) || undefined,
    supplements: project.supplements?.filter(Boolean) || undefined,
    analyticsKey: project.analyticsKey,
    currentUserCanComment: project.currentUserCanComment,
    currentUserPermissions: project.currentUserPermissions || [],
    currentUserIsContributor: project.currentUserIsContributor,
    currentUserIsContributorOrGroupMember: project.currentUserIsContributorOrGroupMember,
    wikiEnabled: project.wikiEnabled,
    subjects: subjects,
    contributors: bibliographicContributors?.filter(Boolean) || [],
    customCitation: project.customCitation || null,
    region: project.region || undefined,
    affiliatedInstitutions: project.affiliatedInstitutions?.filter(Boolean) || undefined,
    forksCount: project.forksCount || 0,
    viewOnlyLinksCount: project.viewOnlyLinksCount || 0,
    isAnonymous,
  };
}
