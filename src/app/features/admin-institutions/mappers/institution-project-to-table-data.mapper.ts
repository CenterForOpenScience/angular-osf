import { InstitutionProject, TableCellData, TableCellLink } from '@osf/features/admin-institutions/models';

export function mapProjectToTableCellData(project: InstitutionProject): TableCellData {
  return {
    title: {
      url: project.id,
      text: project.title,
    } as TableCellLink,
    link: {
      url: project.id,
      text: project.identifier || project.id,
    } as TableCellLink,
    dateCreated: project.dateCreated,
    dateModified: project.dateModified,
    doi: '-',
    storageLocation: project.storageRegion || '-',
    totalDataStored: project.storageByteCount ? `${(project.storageByteCount / (1024 * 1024)).toFixed(1)} MB` : '0 B',
    creator: {
      url: project.creator || '#',
      text: project.creator || '-',
    } as TableCellLink,
    views: project.viewCount?.toString() || '-',
    resourceType: project.resourceType,
    license: project.rights || '-',
    addOns: '-',
    funderName: '-',
  };
}
