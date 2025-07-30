import { CedarMetadataRecord, CedarRecordDataBinding } from '@osf/features/project/metadata/models';

export function CedarFormMapper(data: CedarRecordDataBinding, registryId: string): CedarMetadataRecord {
  return {
    data: {
      type: 'cedar_metadata_records' as const,
      attributes: {
        metadata: data.data,
        is_published: false,
      },
      relationships: {
        template: {
          data: {
            type: 'cedar-metadata-templates' as const,
            id: data.id,
          },
        },
        target: {
          data: {
            type: 'registrations' as const,
            id: registryId,
          },
        },
      },
    },
  };
}
