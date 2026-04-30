import { MetadataField } from '../models';

export const FileMetadataFields: MetadataField[] = [
  { key: 'title', label: 'common.labels.title' },
  { key: 'description', label: 'common.labels.description' },
  { key: 'resourceTypeGeneral', label: 'files.detail.fileMetadata.fields.resourceType' },
  { key: 'language', label: 'files.detail.fileMetadata.fields.resourceLanguage' },
];
