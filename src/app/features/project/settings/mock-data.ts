export const mockSettingsData = {
  tableData: [
    {
      linkName: 'name',
      sharedComponents: 'Project name',
      createdDate: new Date(),
      createdBy: 'Igor',
      anonymous: false,
      link: 'www.facebook.com',
    },
    {
      linkName: 'name',
      sharedComponents: 'Project name',
      createdDate: new Date(),
      createdBy: 'Igor',
      anonymous: false,
      link: 'www.facebook.com',
    },
    {
      linkName: 'name',
      sharedComponents: 'Project name',
      createdDate: new Date(),
      createdBy: 'Igor',
      anonymous: false,
      link: 'www.facebook.com',
    },
    {
      linkName: 'name',
      sharedComponents: 'Project name',
      createdDate: new Date(),
      createdBy: 'Igor',
      anonymous: false,
      link: 'www.facebook.com',
    },
  ],
  access: 'write',
  accessOptions: [
    { label: 'Contributors (with write access)', value: 'write' },
    { label: 'Anyone with link', value: 'public' },
  ],
  commentSetting: 'instantly',
  fileSetting: 'instantly',
  dropdownOptions: [
    { label: 'Instantly', value: 'instantly' },
    { label: 'Daily', value: 'daily' },
    { label: 'Never', value: 'never' },
  ],
  affiliations: [
    {
      name: 'Center for Open Science',
      canDelete: true,
    },
  ],
  rightControls: {
    wiki: [
      {
        type: 'dropdown',
        label: 'Who can edit:',
        value: 'write',
        options: [
          { label: 'Contributors (with write access)', value: 'write' },
          { label: 'Anyone with link', value: 'public' },
        ],
        onChange: (value: string) => console.log('Access changed to', value),
      },
    ],
    notifications: [
      {
        type: 'dropdown',
        label: 'Comments added:',
        value: 'instantly',
        options: [
          { label: 'Instantly', value: 'instantly' },
          { label: 'Daily', value: 'daily' },
          { label: 'Never', value: 'never' },
        ],
      },
      {
        type: 'dropdown',
        label: 'Files updated:',
        value: 'instantly',
        options: [
          { label: 'Instantly', value: 'instantly' },
          { label: 'Daily', value: 'daily' },
          { label: 'Never', value: 'never' },
        ],
      },
    ],
  },
};
