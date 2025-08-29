import { Funder } from '@osf/features/metadata/models';

export const MOCK_FUNDERS: Funder[] = [
  {
    funderName: 'National Science Foundation',
    funderIdentifier: '10.13039/100000001',
    funderIdentifierType: 'Crossref Funder ID',
    awardNumber: 'NSF-1234567',
    awardUri: 'https://www.nsf.gov/awardsearch/showAward?AWD_ID=1234567',
    awardTitle: 'Research Grant for Advanced Computing',
  },
  {
    funderName: 'National Institutes of Health',
    funderIdentifier: '10.13039/100000002',
    funderIdentifierType: 'Crossref Funder ID',
    awardNumber: 'NIH-R01-GM123456',
    awardUri: 'https://reporter.nih.gov/project-details/12345678',
    awardTitle: 'Biomedical Research Project',
  },
];
