import { Funder } from '@osf/features/project/metadata/models';

export const MOCK_FUNDERS: Funder[] = [
  {
    funder_name: 'National Science Foundation',
    funder_identifier: '10.13039/100000001',
    funder_identifier_type: 'Crossref Funder ID',
    award_number: 'NSF-1234567',
    award_uri: 'https://www.nsf.gov/awardsearch/showAward?AWD_ID=1234567',
    award_title: 'Research Grant for Advanced Computing',
  },
  {
    funder_name: 'National Institutes of Health',
    funder_identifier: '10.13039/100000002',
    funder_identifier_type: 'Crossref Funder ID',
    award_number: 'NIH-R01-GM123456',
    award_uri: 'https://reporter.nih.gov/project-details/12345678',
    award_title: 'Biomedical Research Project',
  },
];
