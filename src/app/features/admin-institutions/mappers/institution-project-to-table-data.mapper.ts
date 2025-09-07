import { TableCellData, TableCellLink } from '@osf/features/admin-institutions/models';
import { Resource } from '@shared/models';

export function mapProjectResourceToTableCellData(resource: Resource): TableCellData {
  return {
    title: {
      url: resource.absoluteUrl,
      text: resource.title,
    } as TableCellLink,
    link: {
      url: resource.absoluteUrl,
      text: resource.absoluteUrl.split('/').pop() || resource.absoluteUrl,
    } as TableCellLink,
    dateCreated: resource.dateCreated!,
    dateModified: resource.dateModified!,
    doi: '-',
    storageLocation: 'will be parsed soon',
    totalDataStored: 'will be parsed soon',
    creator: {
      url: resource.creators[0].absoluteUrl || '#',
      text: resource.creators[0].name || '-',
    } as TableCellLink,
    views: 'will be parsed soon',
    resourceType: resource.resourceNature || '-',
    license: resource.license?.name || '-',
    addOns: '-',
    funderName: resource.funders?.[0]?.name || '-',
  };

  //[RNi] TODO: totalDataStored: project.storageByteCount ? `${(project.storageByteCount / (1024 * 1024)).toFixed(1)} MB` : '0 B',
}
