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

export const users = {
  data: [
    {
      id: '38fa674d7bbb183efadf86070cdbe996c64ee2d25b4c74d9cd524a410b5f1f98',
      type: 'institution-users',
      attributes: {
        report_yearmonth: '2025-06',
        user_name: 'Doug Corell',
        department: null,
        orcid_id: '0000-0003-0945-8731',
        month_last_login: '2023-01',
        month_last_active: '2022-03',
        account_creation_date: '2021-03',
        public_projects: 0,
        private_projects: 8,
        public_registration_count: 3,
        embargoed_registration_count: 0,
        published_preprint_count: 1,
        public_file_count: 4,
        storage_byte_count: 4600004315,
        contacts: [],
      },
      relationships: {
        user: {
          links: {
            related: {
              href: 'https://api.test.osf.io/v2/users/f5vmj/',
              meta: {},
            },
          },
          data: {
            id: 'f5vmj',
            type: 'users',
          },
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
    {
      id: '34aad14d5eec09580661d9db38967467695f158063b24a6f21a1d533d6cf15c2',
      type: 'institution-users',
      attributes: {
        report_yearmonth: '2025-06',
        user_name: 'Blaine Butler',
        department: null,
        orcid_id: null,
        month_last_login: '2025-06',
        month_last_active: '2025-06',
        account_creation_date: '2022-07',
        public_projects: 27,
        private_projects: 43,
        public_registration_count: 65,
        embargoed_registration_count: 4,
        published_preprint_count: 76,
        public_file_count: 1149,
        storage_byte_count: 2519450324,
        contacts: [
          {
            sender_name: 'Blaine Butler',
            count: 1,
          },
        ],
      },
      relationships: {
        user: {
          links: {
            related: {
              href: 'https://api.test.osf.io/v2/users/atryg/',
              meta: {},
            },
          },
          data: {
            id: 'atryg',
            type: 'users',
          },
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
    {
      id: '36fb6eac48f8d2329efebbea32fdeb2037781c2fdc7f810a192138619ec254fb',
      type: 'institution-users',
      attributes: {
        report_yearmonth: '2025-06',
        user_name: 'Ramyashri Virajamangala',
        department: null,
        orcid_id: '0009-0001-7982-6352',
        month_last_login: '2025-07',
        month_last_active: '2025-06',
        account_creation_date: '2023-10',
        public_projects: 11,
        private_projects: 12,
        public_registration_count: 11,
        embargoed_registration_count: 0,
        published_preprint_count: 25,
        public_file_count: 137,
        storage_byte_count: 253874264,
        contacts: [],
      },
      relationships: {
        user: {
          links: {
            related: {
              href: 'https://api.test.osf.io/v2/users/kzqhy/',
              meta: {},
            },
          },
          data: {
            id: 'kzqhy',
            type: 'users',
          },
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
    {
      id: '5cecc442620ea58a48408ef7b0e095f054bd98ff89cf64e26cbc3a2022843b96',
      type: 'institution-users',
      attributes: {
        report_yearmonth: '2025-06',
        user_name: 'Eric Olson',
        department: null,
        orcid_id: '0000-0002-5989-8244',
        month_last_login: '2025-06',
        month_last_active: '2025-06',
        account_creation_date: '2020-02',
        public_projects: 12,
        private_projects: 20,
        public_registration_count: 25,
        embargoed_registration_count: 0,
        published_preprint_count: 38,
        public_file_count: 95,
        storage_byte_count: 230015709,
        contacts: [],
      },
      relationships: {
        user: {
          links: {
            related: {
              href: 'https://api.test.osf.io/v2/users/cdr63/',
              meta: {},
            },
          },
          data: {
            id: 'cdr63',
            type: 'users',
          },
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
    {
      id: 'f81e4a6d479ea6c50b3b200be4de9f3f871ab99c5f1138714a29564372d72c72',
      type: 'institution-users',
      attributes: {
        report_yearmonth: '2025-06',
        user_name: 'Daniel Steger',
        department: null,
        orcid_id: null,
        month_last_login: '2025-06',
        month_last_active: '2025-04',
        account_creation_date: '2021-09',
        public_projects: 13,
        private_projects: 17,
        public_registration_count: 18,
        embargoed_registration_count: 0,
        published_preprint_count: 16,
        public_file_count: 3562,
        storage_byte_count: 150733824,
        contacts: [],
      },
      relationships: {
        user: {
          links: {
            related: {
              href: 'https://api.test.osf.io/v2/users/fs8ux/',
              meta: {},
            },
          },
          data: {
            id: 'fs8ux',
            type: 'users',
          },
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
    {
      id: '4144d8ae33cbdbd94f24f0e1534593c1217f356d5de1928a9dee3bee77c85921',
      type: 'institution-users',
      attributes: {
        report_yearmonth: '2025-06',
        user_name: 'Sara Bowman',
        department: null,
        orcid_id: null,
        month_last_login: '2020-07',
        month_last_active: '2022-10',
        account_creation_date: '2017-12',
        public_projects: 9,
        private_projects: 4,
        public_registration_count: 20,
        embargoed_registration_count: 0,
        published_preprint_count: 35,
        public_file_count: 130,
        storage_byte_count: 146351639,
        contacts: [],
      },
      relationships: {
        user: {
          links: {
            related: {
              href: 'https://api.test.osf.io/v2/users/3pwky/',
              meta: {},
            },
          },
          data: {
            id: '3pwky',
            type: 'users',
          },
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
    {
      id: 'f118c80b5ccd5402887ec511bb423f6dc6ccca385ee1cfd7accb27429b1a374b',
      type: 'institution-users',
      attributes: {
        report_yearmonth: '2025-06',
        user_name: 'QA Runscope',
        department: null,
        orcid_id: null,
        month_last_login: '2025-06',
        month_last_active: '2025-06',
        account_creation_date: '2018-09',
        public_projects: 1,
        private_projects: 190,
        public_registration_count: 1,
        embargoed_registration_count: 0,
        published_preprint_count: 973,
        public_file_count: 1003,
        storage_byte_count: 119760397,
        contacts: [],
      },
      relationships: {
        user: {
          links: {
            related: {
              href: 'https://api.test.osf.io/v2/users/9p57h/',
              meta: {},
            },
          },
          data: {
            id: '9p57h',
            type: 'users',
          },
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
    {
      id: '315523a12fc2283a749f2a49d219cdc82c547c15e5a327162b8328f7bc9b8b04',
      type: 'institution-users',
      attributes: {
        report_yearmonth: '2025-06',
        user_name: 'DC Test  Emu',
        department: null,
        orcid_id: null,
        month_last_login: '2023-08',
        month_last_active: '2023-08',
        account_creation_date: '2021-03',
        public_projects: 6,
        private_projects: 41,
        public_registration_count: 15,
        embargoed_registration_count: 0,
        published_preprint_count: 2,
        public_file_count: 38,
        storage_byte_count: 96648435,
        contacts: [],
      },
      relationships: {
        user: {
          links: {
            related: {
              href: 'https://api.test.osf.io/v2/users/e3sfk/',
              meta: {},
            },
          },
          data: {
            id: 'e3sfk',
            type: 'users',
          },
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
    {
      id: '8236e4218a5f9031f60ac0d2838a52ad35495e9c1f22f6d083ebf43f694ff364',
      type: 'institution-users',
      attributes: {
        report_yearmonth: '2025-06',
        user_name: 'Nici Product',
        department: null,
        orcid_id: null,
        month_last_login: '2025-02',
        month_last_active: '2022-10',
        account_creation_date: '2017-12',
        public_projects: 9,
        private_projects: 6,
        public_registration_count: 19,
        embargoed_registration_count: 0,
        published_preprint_count: 24,
        public_file_count: 114,
        storage_byte_count: 68132397,
        contacts: [],
      },
      relationships: {
        user: {
          links: {
            related: {
              href: 'https://api.test.osf.io/v2/users/783bw/',
              meta: {},
            },
          },
          data: {
            id: '783bw',
            type: 'users',
          },
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
    {
      id: '2850634d59be53903057da707177a1ae34ee22a19e32308bfa2e62ad5664a2b1',
      type: 'institution-users',
      attributes: {
        report_yearmonth: '2025-06',
        user_name: 'Eric Test',
        department: null,
        orcid_id: null,
        month_last_login: '2021-10',
        month_last_active: '2021-10',
        account_creation_date: '2021-10',
        public_projects: 1,
        private_projects: 4,
        public_registration_count: 6,
        embargoed_registration_count: 0,
        published_preprint_count: 3,
        public_file_count: 15,
        storage_byte_count: 66493398,
        contacts: [],
      },
      relationships: {
        user: {
          links: {
            related: {
              href: 'https://api.test.osf.io/v2/users/ahe9k/',
              meta: {},
            },
          },
          data: {
            id: 'ahe9k',
            type: 'users',
          },
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
  ],
  meta: {
    total: 173,
    per_page: 10,
    version: '2.20',
  },
  links: {
    self: 'https://api.test.osf.io/v2/institutions/cos/metrics/users/?size=1',
    first: null,
    last: 'https://api.test.osf.io/v2/institutions/cos/metrics/users/?page=18&size=1',
    prev: null,
    next: 'https://api.test.osf.io/v2/institutions/cos/metrics/users/?page=2&size=1',
  },
};
