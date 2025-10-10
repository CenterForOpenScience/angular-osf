import { getSortedContributorsByPermissions } from '@shared/helpers';
import { ResourceModel } from '@shared/models';

export function mapCreators(project: ResourceModel, currentInstitutionId: string) {
  const creatorsRoles = project.qualifiedAttribution.map((qa) => {
    let role;
    if (qa.hadRole.includes('admin')) {
      role = 'Administrator';
    } else if (qa.hadRole.includes('write')) {
      role = 'Read + Write';
    } else {
      role = 'Read';
    }
    return {
      id: qa.agentId,
      role,
    };
  });

  return getSortedContributorsByPermissions(project)
    ?.filter((creator) => creator.affiliationsAbsoluteUrl.includes(currentInstitutionId))
    ?.map((creator) => {
      const name = creator.name.trim();
      const role = creatorsRoles.find((cr) => cr.id === creator.absoluteUrl)!.role;
      return {
        text: `${name} (${role})`,
        url: creator.absoluteUrl,
      };
    })
    ?.slice(0, 2);
}
