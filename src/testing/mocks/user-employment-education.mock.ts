import { Education, Employment } from '@osf/shared/models';

export const MOCK_EMPLOYMENT: Employment[] = [
  {
    title: 'Senior Developer',
    institution: 'Tech Corp',
    department: 'Engineering',
    startMonth: 1,
    startYear: 2020,
    endMonth: null,
    endYear: null,
    ongoing: true,
  },
];

export const MOCK_EDUCATION: Education[] = [
  {
    institution: 'University of Example',
    department: 'Computer Science',
    degree: 'PhD',
    startMonth: 9,
    startYear: 2015,
    endMonth: 6,
    endYear: 2019,
    ongoing: false,
  },
];
