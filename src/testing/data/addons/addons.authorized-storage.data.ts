import structuredClone from 'structured-clone';

const AuthorizedStorage = {
  data: {
    type: 'authorized-storage-accounts',
    id: '0ab44840-5a37-4a79-9e94-9b5f5830159a',
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
            'https://addons.test.osf.io/v1/authorized-storage-accounts/0ab44840-5a37-4a79-9e94-9b5f5830159a/account_owner',
        },
        data: {
          type: 'user-references',
          id: '0e761652-ac4c-427e-b31c-7317d53ef32a',
        },
      },
      authorized_operations: {
        links: {
          related:
            'https://addons.test.osf.io/v1/authorized-storage-accounts/0ab44840-5a37-4a79-9e94-9b5f5830159a/authorized_operations',
        },
      },
      configured_storage_addons: {
        links: {
          related:
            'https://addons.test.osf.io/v1/authorized-storage-accounts/0ab44840-5a37-4a79-9e94-9b5f5830159a/configured_storage_addons',
        },
      },
      external_storage_service: {
        links: {
          related:
            'https://addons.test.osf.io/v1/authorized-storage-accounts/0ab44840-5a37-4a79-9e94-9b5f5830159a/external_storage_service',
        },
        data: {
          type: 'external-storage-services',
          id: '986c6ba5-ff9b-4a57-8c01-e58ff4cd48ca',
        },
      },
    },
    links: {
      self: 'https://addons.test.osf.io/v1/authorized-storage-accounts/0ab44840-5a37-4a79-9e94-9b5f5830159a',
    },
  },
};

export function getAddonsAuthorizedStorageData() {
  return structuredClone(AuthorizedStorage);
}
