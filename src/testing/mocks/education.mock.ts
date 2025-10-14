import { Education } from '@shared/models';

export const MOCK_EDUCATION: Education[] = [
  {
    institution: 'University of Technology',
    department: 'Computer Science',
    degree: 'Bachelor of Science',
    startMonth: 9,
    startYear: 2021,
    endMonth: 5,
    endYear: 2025,
    ongoing: true,
  },
  {
    institution: 'Advanced University',
    department: 'Software Engineering',
    degree: 'Master of Science',
    startMonth: 9,
    startYear: 2020,
    endMonth: 8,
    endYear: 2025,
    ongoing: false,
  },
];
