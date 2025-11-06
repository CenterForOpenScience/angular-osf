import { Employment } from '@osf/shared/models/user/employment.model';

export const MOCK_EMPLOYMENT: Employment[] = [
  {
    title: 'Senior Software Engineer',
    institution: 'Tech Company Inc.',
    department: 'Engineering',
    startMonth: 6,
    startYear: 2022,
    endMonth: null,
    endYear: null,
    ongoing: true,
  },
  {
    title: 'Software Engineer Intern',
    institution: 'University Research Lab',
    department: 'Computer Science',
    startMonth: 9,
    startYear: 2019,
    endMonth: 12,
    endYear: 2019,
    ongoing: false,
  },
];
