import { getSortedContributorsByPermissions } from '@shared/helpers';
import { ResourceModel } from '@shared/models';

import { extractPathAfterDomain } from '../helpers';
import { TableCellData } from '../models';

export function mapProjectResourceToTableCellData(project: ResourceModel, currentInstitutionId: string): TableCellData {
  return {
    title: project.title,
    link: {
      url: project.absoluteUrl,
      text: project.absoluteUrl.split('/').pop() || project.absoluteUrl,
    },
    dateCreated: project.dateCreated!,
    dateModified: project.dateModified!,
    doi: project.doi[0]
      ? {
          text: extractPathAfterDomain(project.doi[0]),
          url: project.doi[0],
        }
      : '-',
    storageLocation: project.storageRegion || '-',
    totalDataStored: project.storageByteCount ? `${(+project.storageByteCount / (1024 * 1024)).toFixed(1)} MB` : '0 B',
    creator: mapCreators(project, currentInstitutionId),
    views: project.viewsCount || '-',
    resourceType: project.resourceNature || '-',
    license: project.license?.name || '-',
    addOns: project.addons?.join(',') || '-',
    funderName: project.funders?.[0]?.name || '-',
  };
}

function mapCreators(project: ResourceModel, currentInstitutionId: string) {
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
    ?.filter((creator) => creator.affiliationAbsoluteUrl === currentInstitutionId)
    ?.map((creator) => {
      const name = creator.name.trim();
      const role = creatorsRoles.find((cr) => cr.id === creator.absoluteUrl)!.role;
      return {
        text: `${name} (${role})`,
        url: creator.absoluteUrl,
      };
    });
}
