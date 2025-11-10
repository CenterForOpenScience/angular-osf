import { NodeStorageModel } from '@osf/shared/models/nodes/node-storage.model';
import { NodeStorageDataJsonApi } from '@osf/shared/models/nodes/node-storage-json-api.model';

export class NodeStorageMapper {
  static getNodeStorage(data: NodeStorageDataJsonApi): NodeStorageModel {
    return {
      id: data.id,
      storageLimitStatus: data.attributes.storage_limit_status,
      storageUsage: data.attributes.storage_usage,
    };
  }
}
