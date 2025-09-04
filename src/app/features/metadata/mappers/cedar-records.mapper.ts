import { CedarMetadataRecord, CedarRecordDataBinding } from '../models';

export class CedarRecordsMapper {
  static toCedarRecordsPayload(
    data: CedarRecordDataBinding,
    resourceId: string,
    resourceType: string
  ): CedarMetadataRecord {
    return {
      data: {
        type: 'cedar_metadata_records',
        attributes: {
          metadata: data.data,
          is_published: data.isPublished,
        },
        relationships: {
          template: {
            data: {
              type: 'cedar-metadata-templates',
              id: data.id,
            },
          },
          target: {
            data: {
              type: resourceType,
              id: resourceId,
            },
          },
        },
      },
    };
  }
}
