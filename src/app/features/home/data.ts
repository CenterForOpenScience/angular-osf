import { Project } from '@osf/features/home/models/project.entity';

export const projects: Project[] = [
  {
    id: '1',
    title: 'Project name example',
    dateModified: new Date(),
    bibliographicContributors: [
      {
        id: '1',
        unregisteredContributor: 'Steger',
      },
      {
        id: '2',
        unregisteredContributor: 'Oison',
      },
      {
        id: '2',
        unregisteredContributor: 'Errington',
      },
    ],
    links: null,
  },
  {
    id: '2',
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    dateModified: new Date(),
    bibliographicContributors: [
      {
        id: '1',
        unregisteredContributor: 'Longsurname1',
      },
      {
        id: '2',
        unregisteredContributor: 'Loremipsumdolosit',
      },
      {
        id: '2',
        unregisteredContributor:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
    ],
    links: null,
  },
  {
    id: '3',
    title: 'Lorem ipsum dolor sit amet',
    dateModified: new Date(),
    bibliographicContributors: [
      {
        id: '1',
        unregisteredContributor: 'Loremipsumdolorsitam1',
      },
      {
        id: '2',
        unregisteredContributor: 'Loremipsumdolorsitamipsumdol2',
      },
    ],
    links: null,
  },
  {
    id: '4',
    title: 'Project long name example Lorem ipsum dolor/',
    dateModified: new Date(),
    bibliographicContributors: [
      {
        id: '1',
        unregisteredContributor: 'Steger',
      },
      {
        id: '2',
        unregisteredContributor: 'Oison',
      },
      {
        id: '2',
        unregisteredContributor: 'Errington',
      },
    ],
    links: null,
  },
  {
    id: '5',
    title: 'Project long name example /',
    dateModified: new Date(),
    bibliographicContributors: [
      {
        id: '1',
        unregisteredContributor: 'Steger',
      },
      {
        id: '2',
        unregisteredContributor: 'Oison',
      },
      {
        id: '2',
        unregisteredContributor: 'Errington',
      },
    ],
    links: null,
  },
  {
    id: '6',
    title: 'Project long name example',
    dateModified: new Date(),
    bibliographicContributors: [
      {
        id: '1',
        unregisteredContributor: 'Steger',
      },
      {
        id: '2',
        unregisteredContributor: 'Oison',
      },
      {
        id: '2',
        unregisteredContributor: 'Errington',
      },
    ],
    links: null,
  },
  {
    id: '7',
    title: 'Project  long name example Lorem ipsum dolor sit amet',
    dateModified: new Date(),
    bibliographicContributors: [
      {
        id: '1',
        unregisteredContributor: 'Longsurname1',
      },
      {
        id: '2',
        unregisteredContributor: 'Loremipsumdolosit',
      },
      {
        id: '2',
        unregisteredContributor: 'Loremipsumdolorsitam',
      },
    ],
    links: null,
  },
  {
    id: '8',
    title: 'Lorem ipsum dolor sit amet',
    dateModified: new Date(),
    bibliographicContributors: [
      {
        id: '1',
        unregisteredContributor: 'Loremipsumdolorsitam1',
      },
      {
        id: '2',
        unregisteredContributor: 'Loremipsumdolorsitamipsumdol2',
      },
    ],
    links: null,
  },
  {
    id: '9',
    title: 'Project  long name example Lorem ipsum dolor sit amet',
    dateModified: new Date(),
    bibliographicContributors: [
      {
        id: '1',
        unregisteredContributor: 'Longsurname1',
      },
      {
        id: '2',
        unregisteredContributor: 'Loremipsumdolosit',
      },
      {
        id: '2',
        unregisteredContributor: 'Loremipsumdolorsitam',
      },
    ],
    links: null,
  },
  {
    id: '10',
    title: 'Lorem ipsum dolor sit amet',
    dateModified: new Date(),
    bibliographicContributors: [
      {
        id: '1',
        unregisteredContributor: 'Loremipsumdolorsitam1',
      },
      {
        id: '2',
        unregisteredContributor: 'Loremipsumdolorsitamipsumdol2',
      },
    ],
    links: null,
  },
];

export const noteworthy = [
  {
    title:
      'CLINICAL APPLICATIONS OF DIGITAL DENTISTRY IN PEDIATRIC DENTISTRY: SCOPE REVIEW',
    authors: 'by Moreira, Imparato, Borges, and 1 more',
  },
  {
    title:
      'Transcutaneous electrical nerve stimulation enhances gait adaptation savings in multiple sclerosis',
    authors: 'by Hagen, Whittier, Stephens, and 1 more',
  },
  {
    title:
      'New technologies of the lipid fraction of industrialized parenteral nutrition, does the incorporation bring results in the clinical results of patients? A scoping review of the literature',
    authors: 'by de Oliveira and Manin',
  },
  {
    title:
      'Corticospinal Excitability in Response to Mediolateral Gait Instability',
    authors: 'by Raven, Davies, and Bruijn',
  },
  {
    title: 'Topic Modeling - Mississippi River Basin Literature',
    authors: 'by Wimhurst, Koch, and McPherson',
  },
];

export const mostPopular = [
  {
    title: 'PsiChiR',
    authors: 'by Wagge, Staples, Edlund, and 3 more',
  },
  {
    title:
      'Data and Code for "Evaluating large language models in theory of mind tasks"',
    authors: 'by Kosinski',
  },
  {
    title:
      'The Data Detectives! A Game of Persistent Identifiers (PIDfest 2024)',
    authors: 'by Olson',
  },
  {
    title: 'Working Group on NIH DMSP Guidance',
    authors: 'by Ye, Hertz, Badger, and 26 more',
  },
  {
    title: 'Better Scientific Poster',
    authors: 'by Morrison',
  },
];
