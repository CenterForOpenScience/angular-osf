import { extractPathAfterDomain } from '@osf/features/admin-institutions/helpers';
import { TableCellData, TableCellLink } from '@osf/features/admin-institutions/models';
import { ResourceModel } from '@shared/models';

export function mapProjectResourceToTableCellData(project: ResourceModel): TableCellData {
  return {
    title: {
      url: project.absoluteUrl,
      text: project.title,
    } as TableCellLink,
    link: {
      url: project.absoluteUrl,
      text: project.absoluteUrl.split('/').pop() || project.absoluteUrl,
    } as TableCellLink,
    dateCreated: project.dateCreated!,
    dateModified: project.dateModified!,
    doi: project.doi[0]
      ? ({
          text: extractPathAfterDomain(project.doi[0]),
          url: project.doi[0],
        } as TableCellLink)
      : '-',
    storageLocation: project.storageRegion || '-',
    totalDataStored: project.storageByteCount ? `${(+project.storageByteCount / (1024 * 1024)).toFixed(1)} MB` : '0 B',
    creator: {
      url: project.creators[0].absoluteUrl || '#',
      text: project.creators[0].name || '-',
    } as TableCellLink,
    views: project.viewsCount || '-',
    resourceType: project.resourceNature || '-',
    license: project.license?.name || '-',
    addOns: project.addons?.join(',') || '-',
    funderName: project.funders?.[0]?.name || '-',
  };
}
