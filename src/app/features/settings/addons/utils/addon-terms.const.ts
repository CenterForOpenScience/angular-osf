export interface AddonTermsMessages {
  labels: {
    'add-update-files': string;
    'delete-files': string;
    forking: string;
    logs: string;
    permissions: string;
    registering: string;
    'file-versions': string;
  };
  storage: {
    'add-update-files-true': string;
    'add-update-files-false': string;
    'add-update-files-partial': string;
    'delete-files-true': string;
    'delete-files-false': string;
    'delete-files-partial': string;
    'forking-true': string;
    'logs-true': string;
    'logs-false': string;
    'permissions-true': string;
    'registering-true': string;
    'file-versions-true': string;
    'file-versions-false': string;
  };
  citation: {
    'forking-partial': string;
    'permissions-partial': string;
    'registering-false': string;
  };
}

export const ADDON_TERMS_MESSAGES: AddonTermsMessages = {
  labels: {
    'add-update-files': 'Add / update files',
    'delete-files': 'Delete files',
    forking: 'Forking',
    logs: 'Logs',
    permissions: 'Permissions',
    registering: 'Registering',
    'file-versions': 'View / download file versions',
  },
  storage: {
    'add-update-files-true':
      'Adding/updating files within OSF will be reflected in {provider}.',
    'add-update-files-false':
      'You cannot add or update files for {provider} within OSF.',
    'add-update-files-partial': 'Files can be added but not updated.',
    'delete-files-true': 'Files deleted in OSF will be deleted in {provider}.',
    'delete-files-false': 'You cannot delete files for {provider} within OSF.',
    'delete-files-partial':
      '{provider} has limitations on which files can be deleted within OSF.',
    'forking-true':
      'Only the user who first authorized the {provider} add-on within source project can transfer its authorization to a forked project or component.',
    'logs-true':
      'OSF tracks changes you make to your {provider} content within OSF, but not changes made directly within {provider}.',
    'logs-false':
      'OSF does not keep track of changes made using {provider} directly.',
    'permissions-true':
      'The OSF does not change permissions for linked {provider} files. Privacy changes made to an OSF project or component will not affect those set in {provider}.',
    'registering-true':
      '{provider} content will be registered, but version history will not be copied to the registration.',
    'file-versions-true':
      '{provider} files and their versions can be viewed/downloaded in OSF.',
    'file-versions-false':
      '{provider} files can be viewed/downloaded in OSF, but version history is not supported.',
  },
  citation: {
    'forking-partial':
      'Forking a project or component does not copy {provider} authorization unless the user forking the project is the same user who authorized the {provider} add-on in the source project being forked.',
    'permissions-partial':
      'Making an OSF project public or private is independent of making a {provider} folder public or private. The OSF does not alter the permissions of a linked {provider} folder.',
    'registering-false': '{provider} content will not be registered.',
  },
};
