import structuredClone from 'structured-clone';

const ExternalStorage = {
  links: {
    first: 'https://addons.staging4.osf.io/v1/external-storage-services?page%5Bnumber%5D=1',
    last: 'https://addons.staging4.osf.io/v1/external-storage-services?page%5Bnumber%5D=1',
    next: null,
    prev: null,
  },
  data: [
    {
      type: 'external-storage-services',
      id: '1d8d9be2-522e-4969-b8fa-bfb45ae13c0d',
      attributes: {
        auth_uri: 'https://figshare.com/account/applications/authorize',
        credentials_format: 'OAUTH2',
        max_concurrent_downloads: 2,
        max_upload_mb: 5120,
        display_name: 'figshare',
        wb_key: 'figshare',
        external_service_name: 'figshare',
        configurable_api_root: false,
        supported_features: ['DOWNLOAD_AS_ZIP', 'FORKING', 'LOGS', 'PERMISSIONS', 'REGISTERING'],
        icon_url: 'https://addons.staging4.osf.io/static/provider_icons/figshare.svg',
        api_base_url_options: [],
      },
      relationships: {
        addon_imp: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/external-storage-services/1d8d9be2-522e-4969-b8fa-bfb45ae13c0d/addon_imp',
          },
          data: {
            type: 'addon-imps',
            id: 'RklHU0hBUkU=',
          },
        },
      },
      links: {
        self: 'https://addons.staging4.osf.io/v1/external-storage-services/1d8d9be2-522e-4969-b8fa-bfb45ae13c0d',
      },
    },
    {
      type: 'external-storage-services',
      id: '5a55e9c5-f2fd-42d2-ad3f-b78f58194e01',
      attributes: {
        auth_uri: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        credentials_format: 'OAUTH2',
        max_concurrent_downloads: 2,
        max_upload_mb: 5120,
        display_name: 'Onedrive',
        wb_key: 'onedrive',
        external_service_name: 'onedrive',
        configurable_api_root: false,
        supported_features: [
          'ADD_UPDATE_FILES',
          'COPY_INTO',
          'DELETE_FILES',
          'DOWNLOAD_AS_ZIP',
          'FILE_VERSIONS',
          'FORKING',
          'LOGS',
          'PERMISSIONS',
          'REGISTERING',
        ],
        icon_url: 'https://addons.staging4.osf.io/static/provider_icons/onedrive.svg',
        api_base_url_options: [],
      },
      relationships: {
        addon_imp: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/external-storage-services/5a55e9c5-f2fd-42d2-ad3f-b78f58194e01/addon_imp',
          },
          data: {
            type: 'addon-imps',
            id: 'T05FRFJJVkU=',
          },
        },
      },
      links: {
        self: 'https://addons.staging4.osf.io/v1/external-storage-services/5a55e9c5-f2fd-42d2-ad3f-b78f58194e01',
      },
    },
    {
      type: 'external-storage-services',
      id: '4ad29105-72c1-4f2f-88fc-72ab3325ad03',
      attributes: {
        auth_uri: 'https://www.dropbox.com/oauth2/authorize?token_access_type=offline',
        credentials_format: 'OAUTH2',
        max_concurrent_downloads: 2,
        max_upload_mb: 1024,
        display_name: 'Dropbox',
        wb_key: 'dropbox',
        external_service_name: 'dropbox',
        configurable_api_root: false,
        supported_features: [
          'ADD_UPDATE_FILES',
          'COPY_INTO',
          'DELETE_FILES',
          'DOWNLOAD_AS_ZIP',
          'FILE_VERSIONS',
          'FORKING',
          'LOGS',
          'PERMISSIONS',
          'REGISTERING',
        ],
        icon_url: 'https://addons.staging4.osf.io/static/provider_icons/dropbox.svg',
        api_base_url_options: [],
      },
      relationships: {
        addon_imp: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/external-storage-services/4ad29105-72c1-4f2f-88fc-72ab3325ad03/addon_imp',
          },
          data: {
            type: 'addon-imps',
            id: 'RFJPUEJPWA==',
          },
        },
      },
      links: {
        self: 'https://addons.staging4.osf.io/v1/external-storage-services/4ad29105-72c1-4f2f-88fc-72ab3325ad03',
      },
    },
    {
      type: 'external-storage-services',
      id: '8aeb85e9-3a73-426f-a89b-5624b4b9d418',
      attributes: {
        auth_uri: 'https://accounts.google.com/o/oauth2/auth?access_type=offline&approval_prompt=force',
        credentials_format: 'OAUTH2',
        max_concurrent_downloads: 2,
        max_upload_mb: 5120,
        display_name: 'Google Drive',
        wb_key: 'googledrive',
        external_service_name: 'googledrive',
        configurable_api_root: false,
        supported_features: [
          'ADD_UPDATE_FILES',
          'COPY_INTO',
          'DELETE_FILES',
          'DOWNLOAD_AS_ZIP',
          'FILE_VERSIONS',
          'FORKING',
          'LOGS',
          'PERMISSIONS',
          'REGISTERING',
        ],
        icon_url: 'https://addons.staging4.osf.io/static/provider_icons/google_drive.svg',
        api_base_url_options: [],
      },
      relationships: {
        addon_imp: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/external-storage-services/8aeb85e9-3a73-426f-a89b-5624b4b9d418/addon_imp',
          },
          data: {
            type: 'addon-imps',
            id: 'R09PR0xFRFJJVkU=',
          },
        },
      },
      links: {
        self: 'https://addons.staging4.osf.io/v1/external-storage-services/8aeb85e9-3a73-426f-a89b-5624b4b9d418',
      },
    },
    {
      type: 'external-storage-services',
      id: '76d96bcf-9234-4ebb-94ca-7260a8008fce',
      attributes: {
        auth_uri: 'https://bitbucket.org/site/oauth2/authorize',
        credentials_format: 'OAUTH2',
        max_concurrent_downloads: 2,
        max_upload_mb: 5120,
        display_name: 'Bitbucket',
        wb_key: 'bitbucket',
        external_service_name: 'bitbucket',
        configurable_api_root: false,
        supported_features: ['DOWNLOAD_AS_ZIP', 'FILE_VERSIONS', 'FORKING', 'LOGS', 'PERMISSIONS', 'REGISTERING'],
        icon_url: 'https://addons.staging4.osf.io/static/provider_icons/bitbucket.svg',
        api_base_url_options: [],
      },
      relationships: {
        addon_imp: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/external-storage-services/76d96bcf-9234-4ebb-94ca-7260a8008fce/addon_imp',
          },
          data: {
            type: 'addon-imps',
            id: 'QklUQlVDS0VU',
          },
        },
      },
      links: {
        self: 'https://addons.staging4.osf.io/v1/external-storage-services/76d96bcf-9234-4ebb-94ca-7260a8008fce',
      },
    },
    {
      type: 'external-storage-services',
      id: 'dcd0e69d-8e96-4da3-a071-5535b9926bde',
      attributes: {
        auth_uri: null,
        credentials_format: 'ACCESS_KEY_SECRET_KEY',
        max_concurrent_downloads: 1,
        max_upload_mb: 1024,
        display_name: 'S3',
        wb_key: 's3',
        external_service_name: 's3',
        configurable_api_root: false,
        supported_features: [
          'ADD_UPDATE_FILES',
          'COPY_INTO',
          'DELETE_FILES',
          'DOWNLOAD_AS_ZIP',
          'FILE_VERSIONS',
          'FORKING',
          'LOGS',
          'PERMISSIONS',
          'REGISTERING',
        ],
        icon_url: 'https://addons.staging4.osf.io/static/provider_icons/s3.svg',
        api_base_url_options: [],
      },
      relationships: {
        addon_imp: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/external-storage-services/dcd0e69d-8e96-4da3-a071-5535b9926bde/addon_imp',
          },
          data: {
            type: 'addon-imps',
            id: 'UzM=',
          },
        },
      },
      links: {
        self: 'https://addons.staging4.osf.io/v1/external-storage-services/dcd0e69d-8e96-4da3-a071-5535b9926bde',
      },
    },
    {
      type: 'external-storage-services',
      id: '56b94182-cb99-4db5-97c1-113fb75ba878',
      attributes: {
        auth_uri: 'https://account.box.com/api/oauth2/authorize',
        credentials_format: 'OAUTH2',
        max_concurrent_downloads: 1,
        max_upload_mb: 1024,
        display_name: 'Box',
        wb_key: 'box',
        external_service_name: 'box',
        configurable_api_root: false,
        supported_features: [
          'ADD_UPDATE_FILES',
          'COPY_INTO',
          'DELETE_FILES',
          'DOWNLOAD_AS_ZIP',
          'FILE_VERSIONS',
          'FORKING',
          'LOGS',
          'PERMISSIONS',
          'REGISTERING',
        ],
        icon_url: 'https://addons.staging4.osf.io/static/provider_icons/box.svg',
        api_base_url_options: [],
      },
      relationships: {
        addon_imp: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/external-storage-services/56b94182-cb99-4db5-97c1-113fb75ba878/addon_imp',
          },
          data: {
            type: 'addon-imps',
            id: 'Qk9Y',
          },
        },
      },
      links: {
        self: 'https://addons.staging4.osf.io/v1/external-storage-services/56b94182-cb99-4db5-97c1-113fb75ba878',
      },
    },
    {
      type: 'external-storage-services',
      id: '14324756-3f98-4c50-a89d-474ab02723a6',
      attributes: {
        auth_uri: 'https://github.com/login/oauth/authorize',
        credentials_format: 'OAUTH2',
        max_concurrent_downloads: 2,
        max_upload_mb: 5120,
        display_name: 'Github',
        wb_key: 'github',
        external_service_name: 'github',
        configurable_api_root: false,
        supported_features: [
          'ADD_UPDATE_FILES',
          'DELETE_FILES',
          'DOWNLOAD_AS_ZIP',
          'FILE_VERSIONS',
          'FORKING',
          'LOGS',
          'PERMISSIONS',
          'REGISTERING',
        ],
        icon_url: 'https://addons.staging4.osf.io/static/provider_icons/github.svg',
        api_base_url_options: [],
      },
      relationships: {
        addon_imp: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/external-storage-services/14324756-3f98-4c50-a89d-474ab02723a6/addon_imp',
          },
          data: {
            type: 'addon-imps',
            id: 'R0lUSFVC',
          },
        },
      },
      links: {
        self: 'https://addons.staging4.osf.io/v1/external-storage-services/14324756-3f98-4c50-a89d-474ab02723a6',
      },
    },
    {
      type: 'external-storage-services',
      id: '686b82c0-e461-4553-94ac-2f7c09f15a11',
      attributes: {
        auth_uri: null,
        credentials_format: 'DATAVERSE_API_TOKEN',
        max_concurrent_downloads: 2,
        max_upload_mb: 5120,
        display_name: 'Dataverse',
        wb_key: 'dataverse',
        external_service_name: 'dataverse',
        configurable_api_root: true,
        supported_features: ['DOWNLOAD_AS_ZIP', 'FILE_VERSIONS', 'FORKING', 'LOGS', 'PERMISSIONS', 'REGISTERING'],
        icon_url: 'https://addons.staging4.osf.io/static/provider_icons/dataverse.svg',
        api_base_url_options: [],
      },
      relationships: {
        addon_imp: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/external-storage-services/686b82c0-e461-4553-94ac-2f7c09f15a11/addon_imp',
          },
          data: {
            type: 'addon-imps',
            id: 'REFUQVZFUlNF',
          },
        },
      },
      links: {
        self: 'https://addons.staging4.osf.io/v1/external-storage-services/686b82c0-e461-4553-94ac-2f7c09f15a11',
      },
    },
    {
      type: 'external-storage-services',
      id: 'b5b5fd1b-2e2c-4c78-a91b-94f244e8029a',
      attributes: {
        auth_uri: null,
        credentials_format: 'PERSONAL_ACCESS_TOKEN',
        max_concurrent_downloads: 2,
        max_upload_mb: 5120,
        display_name: 'GitLab',
        wb_key: 'gitlab',
        external_service_name: 'gitlab',
        configurable_api_root: true,
        supported_features: ['DOWNLOAD_AS_ZIP', 'FILE_VERSIONS', 'FORKING', 'PERMISSIONS', 'REGISTERING'],
        icon_url: 'https://addons.staging4.osf.io/static/provider_icons/gitlab.svg',
        api_base_url_options: [],
      },
      relationships: {
        addon_imp: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/external-storage-services/b5b5fd1b-2e2c-4c78-a91b-94f244e8029a/addon_imp',
          },
          data: {
            type: 'addon-imps',
            id: 'R0lUTEFC',
          },
        },
      },
      links: {
        self: 'https://addons.staging4.osf.io/v1/external-storage-services/b5b5fd1b-2e2c-4c78-a91b-94f244e8029a',
      },
    },
    {
      type: 'external-storage-services',
      id: '2c494613-55e4-40c1-830b-76b06a3121b3',
      attributes: {
        auth_uri: null,
        credentials_format: 'USERNAME_PASSWORD',
        max_concurrent_downloads: 2,
        max_upload_mb: 5120,
        display_name: 'ownCloud',
        wb_key: 'owncloud',
        external_service_name: 'owncloud',
        configurable_api_root: true,
        supported_features: [
          'ADD_UPDATE_FILES',
          'COPY_INTO',
          'DELETE_FILES',
          'DOWNLOAD_AS_ZIP',
          'FILE_VERSIONS',
          'FORKING',
          'LOGS',
          'PERMISSIONS',
          'REGISTERING',
        ],
        icon_url: 'https://addons.staging4.osf.io/static/provider_icons/owncloud.svg',
        api_base_url_options: [],
      },
      relationships: {
        addon_imp: {
          links: {
            related:
              'https://addons.staging4.osf.io/v1/external-storage-services/2c494613-55e4-40c1-830b-76b06a3121b3/addon_imp',
          },
          data: {
            type: 'addon-imps',
            id: 'T1dOQ0xPVUQ=',
          },
        },
      },
      links: {
        self: 'https://addons.staging4.osf.io/v1/external-storage-services/2c494613-55e4-40c1-830b-76b06a3121b3',
      },
    },
  ],
  meta: {
    pagination: {
      page: 1,
      pages: 1,
      count: 11,
    },
  },
};

export function getAddonsExternalStorageData(index?: number, asArray?: boolean) {
  if (index || index === 0) {
    if (asArray) {
      return structuredClone(ExternalStorage.data[index]);
    } else {
      return structuredClone(ExternalStorage.data[index]);
    }
  } else {
    return structuredClone(ExternalStorage);
  }
}
