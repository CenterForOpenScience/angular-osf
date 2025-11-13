import { AddonMapper } from '@osf/shared/mappers/addon.mapper';

import structuredClone from 'structured-clone';

const ConfiguredAddons = {
  data: [
    {
      type: 'configured-storage-addons',
      id: '756579dc-3a24-4849-8866-698a60846ac3',
      attributes: {
        display_name: 'Google Drive',
        root_folder: '0AIl0aR4C9JAFUk9PVA',
        connected_capabilities: ['ACCESS', 'UPDATE'],
        connected_operation_names: ['list_child_items', 'list_root_items', 'get_item_info'],
        current_user_is_owner: true,
        external_service_name: 'googledrive',
      },
      relationships: {
        base_account: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/configured-storage-addons/756579dc-3a24-4849-8866-698a60846ac3/base_account',
          },
          data: {
            type: 'authorized-storage-accounts',
            id: '62ed6dd7-f7b7-4003-b7b4-855789c1f991',
          },
        },
        authorized_resource: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/configured-storage-addons/756579dc-3a24-4849-8866-698a60846ac3/authorized_resource',
          },
          data: {
            type: 'resource-references',
            id: '3193f97c-e6d8-41a4-8312-b73483442086',
          },
        },
        connected_operations: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/configured-storage-addons/756579dc-3a24-4849-8866-698a60846ac3/connected_operations',
          },
        },
        external_storage_service: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/configured-storage-addons/756579dc-3a24-4849-8866-698a60846ac3/external_storage_service',
          },
          data: {
            type: 'external-storage-services',
            id: '8aeb85e9-3a73-426f-a89b-5624b4b9d418',
          },
        },
      },
      links: {
        self: 'https://addons.staging4.osf.io/v1/configured-storage-addons/756579dc-3a24-4849-8866-698a60846ac3',
      },
    },
  ],
};

export function getConfiguredAddonsData(index?: number, asArray?: boolean) {
  if (index || index === 0) {
    if (asArray) {
      return structuredClone(ConfiguredAddons.data[index]);
    } else {
      return structuredClone(ConfiguredAddons.data[index]);
    }
  } else {
    return structuredClone(ConfiguredAddons);
  }
}

export function getConfiguredAddonsMappedData(index?: number, asArray?: boolean) {
  if (index || index === 0) {
    if (asArray) {
      return [structuredClone(AddonMapper.fromConfiguredAddonResponse(ConfiguredAddons.data[index] as any))];
    } else {
      return structuredClone(AddonMapper.fromConfiguredAddonResponse(ConfiguredAddons.data[index] as any));
    }
  } else {
    return structuredClone(ConfiguredAddons.data.map((item) => AddonMapper.fromConfiguredAddonResponse(item)));
  }
}
