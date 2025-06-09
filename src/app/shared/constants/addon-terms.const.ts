import { Term } from '@shared/models';

export const ADDON_TERMS: Term[] = [
  {
    label: 'Add / update files',
    supportedFeature: 'ADD_UPDATE_FILES',
    storage: {
      true: 'Adding/updating files within OSF will be reflected in {provider}.',
      false: 'You cannot add or update files for {provider} within OSF.',
    },
  },
  {
    label: 'Delete files',
    supportedFeature: 'DELETE_FILES',
    storage: {
      true: 'Files deleted in OSF will be deleted in {provider}.',
      false: 'You cannot delete files for {provider} within OSF.',
    },
  },
  {
    label: 'Forking',
    supportedFeature: 'FORKING',
    storage: {
      true: 'Only the user who first authorized the {provider} add-on within source project can transfer its authorization to a forked project or component.',
      false: 'You cannot fork {provider} content.',
    },
    citation: {
      partial:
        'Forking a project or component does not copy {provider} authorization unless the user forking the project is the same user who authorized the {provider} add-on in the source project being forked.',
    },
  },
  {
    label: 'Logs',
    supportedFeature: 'LOGS',
    storage: {
      true: 'OSF tracks changes you make to your {provider} content within OSF, but not changes made directly within {provider}.',
      false: 'OSF does not keep track of changes made using {provider} directly.',
    },
  },
  {
    label: 'Permissions',
    supportedFeature: 'PERMISSIONS',
    storage: {
      true: 'The OSF does not change permissions for linked {provider} files. Privacy changes made to an OSF project or component will not affect those set in {provider}.',
      false: 'You cannot change permissions for {provider} content within OSF.',
    },
    citation: {
      partial:
        'Making an OSF project public or private is independent of making a {provider} folder public or private. The OSF does not alter the permissions of a linked {provider} folder.',
    },
  },
  {
    label: 'Registering',
    supportedFeature: 'REGISTERING',
    storage: {
      true: '{provider} content will be registered, but version history will not be copied to the registration.',
      false: '{provider} content will not be registered.',
    },
    citation: {
      false: '{provider} content will not be registered.',
    },
  },
  {
    label: 'View / download file versions',
    supportedFeature: 'FILE_VERSIONS',
    storage: {
      true: '{provider} files and their versions can be viewed/downloaded in OSF.',
      false: '{provider} files can be viewed/downloaded in OSF, but version history is not supported.',
    },
  },
];
