export const departmens = {
  data: [
    {
      id: 'cos-N/A',
      type: 'institution-departments',
      attributes: {
        name: 'N/A',
        number_of_users: 159,
      },
      links: {
        self: 'https://api.test.osf.io/v2/institutions/cos/metrics/departments/',
      },
    },
    {
      id: 'cos-',
      type: 'institution-departments',
      attributes: {
        name: '',
        number_of_users: 9,
      },
      links: {
        self: 'https://api.test.osf.io/v2/institutions/cos/metrics/departments/',
      },
    },
    {
      id: 'cos-QA',
      type: 'institution-departments',
      attributes: {
        name: 'QA',
        number_of_users: 5,
      },
      links: {
        self: 'https://api.test.osf.io/v2/institutions/cos/metrics/departments/',
      },
    },
  ],
  meta: {
    total: 3,
    per_page: 10,
    version: '2.20',
  },
  links: {
    self: 'https://api.test.osf.io/v2/institutions/cos/metrics/departments/',
    first: null,
    last: null,
    prev: null,
    next: null,
  },
};

export const summaryMetrics = {
  data: {
    id: 'cos',
    type: 'institution-summary-metrics',
    attributes: {
      report_yearmonth: '2025-06',
      user_count: 173,
      public_project_count: 174,
      private_project_count: 839,
      public_registration_count: 360,
      embargoed_registration_count: 76,
      published_preprint_count: 1464,
      public_file_count: 7088,
      storage_byte_count: 12365253682,
      monthly_logged_in_user_count: 14,
      monthly_active_user_count: 15,
    },
    relationships: {
      user: {
        data: null,
      },
      institution: {
        links: {
          related: {
            href: 'https://api.test.osf.io/v2/institutions/cos/',
            meta: {},
          },
        },
        data: {
          id: 'cos',
          type: 'institutions',
        },
      },
    },
    links: {},
  },
  meta: {
    version: '2.20',
  },
};
