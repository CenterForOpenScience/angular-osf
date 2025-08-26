import structuredClone from 'structured-clone';

const AuthorizedStorage = {
  data: [
    {
      type: 'authorized-storage-accounts',
      id: '331b7333-a13a-4d3b-add0-5af0fd1d4ac4',
      attributes: {
        display_name: 'Google Drive',
        api_base_url: 'https://www.googleapis.com',
        auth_url: null,
        authorized_capabilities: ['ACCESS', 'UPDATE'],
        authorized_operation_names: ['list_root_items', 'get_item_info', 'list_child_items'],
        default_root_folder: '',
        credentials_available: true,
        oauth_token: 'ya29.A0AS3H6NzDCKgrUx',
      },
      relationships: {
        account_owner: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/authorized-storage-accounts/331b7333-a13a-4d3b-add0-5af0fd1d4ac4/account_owner',
          },
          data: {
            type: 'user-references',
            id: '0b441148-83e5-4f7f-b302-b07b528b160b',
          },
        },
        authorized_operations: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/authorized-storage-accounts/331b7333-a13a-4d3b-add0-5af0fd1d4ac4/authorized_operations',
          },
        },
        configured_storage_addons: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/authorized-storage-accounts/331b7333-a13a-4d3b-add0-5af0fd1d4ac4/configured_storage_addons',
          },
        },
        external_storage_service: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/authorized-storage-accounts/331b7333-a13a-4d3b-add0-5af0fd1d4ac4/external_storage_service',
          },
          data: {
            type: 'external-storage-services',
            id: '8aeb85e9-3a73-426f-a89b-5624b4b9d418',
          },
        },
      },
      links: {
        self: 'https://addons.staging4.osf.io/v1/authorized-storage-accounts/331b7333-a13a-4d3b-add0-5af0fd1d4ac4',
      },
    },
    {
      type: 'authorized-storage-accounts',
      id: '62ed6dd7-f7b7-4003-b7b4-855789c1f991',
      attributes: {
        display_name: 'Google Drive',
        api_base_url: 'https://www.googleapis.com',
        auth_url: null,
        authorized_capabilities: ['ACCESS', 'UPDATE'],
        authorized_operation_names: ['list_root_items', 'get_item_info', 'list_child_items'],
        default_root_folder: '',
        credentials_available: true,
      },
      relationships: {
        account_owner: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/authorized-storage-accounts/62ed6dd7-f7b7-4003-b7b4-855789c1f991/account_owner',
          },
          data: {
            type: 'user-references',
            id: '0b441148-83e5-4f7f-b302-b07b528b160b',
          },
        },
        authorized_operations: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/authorized-storage-accounts/62ed6dd7-f7b7-4003-b7b4-855789c1f991/authorized_operations',
          },
        },
        configured_storage_addons: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/authorized-storage-accounts/62ed6dd7-f7b7-4003-b7b4-855789c1f991/configured_storage_addons',
          },
        },
        external_storage_service: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/authorized-storage-accounts/62ed6dd7-f7b7-4003-b7b4-855789c1f991/external_storage_service',
          },
          data: {
            type: 'external-storage-services',
            id: '8aeb85e9-3a73-426f-a89b-5624b4b9d418',
          },
        },
      },
      links: {
        self: 'https://addons.staging4.osf.io/v1/authorized-storage-accounts/62ed6dd7-f7b7-4003-b7b4-855789c1f991',
      },
    },
  ],
  included: [
    {
      type: 'external-storage-services',
      id: '8aeb85e9-3a73-426f-a89b-5624b4b9d418',
      attributes: {
        external_service_name: 'googledrive',
      },
      links: {
        self: 'https://addons.staging4.osf.io/v1/external-storage-services/8aeb85e9-3a73-426f-a89b-5624b4b9d418',
      },
    },
  ],
};

export function getAddonsAuthorizedStorageData(index?: number, asArray?: boolean) {
  if (index || index === 0) {
    if (asArray) {
      return Object({
        data: [structuredClone(AuthorizedStorage.data[index])],
      });
    } else {
      return structuredClone({
        data: AuthorizedStorage.data[index],
      });
    }
  } else {
    return structuredClone(AuthorizedStorage);
  }
}
