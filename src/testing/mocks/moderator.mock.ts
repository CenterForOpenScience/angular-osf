import { ModeratorPermission } from '@osf/features/moderation/enums';
import { ModeratorModel } from '@osf/features/moderation/models';

export const MOCK_MODERATORS: ModeratorModel[] = [
  {
    id: '1',
    userId: 'user-1',
    fullName: 'John Doe',
    permission: ModeratorPermission.Admin,
    employment: [
      {
        title: 'Professor',
        institution: 'University of Example',
        department: 'Computer Science',
        startMonth: 1,
        startYear: 2020,
        endMonth: null,
        endYear: null,
        ongoing: true,
      },
    ],
    education: [
      {
        institution: 'University of Example',
        department: 'Computer Science',
        degree: 'PhD',
        startMonth: 9,
        startYear: 2015,
        endMonth: 6,
        endYear: 2020,
        ongoing: false,
      },
    ],
  },
  {
    id: '2',
    userId: 'user-2',
    fullName: 'Jane Smith',
    permission: ModeratorPermission.Moderator,
    employment: [
      {
        title: 'Research Scientist',
        institution: 'Tech University',
        department: 'Data Science',
        startMonth: 3,
        startYear: 2019,
        endMonth: null,
        endYear: null,
        ongoing: true,
      },
    ],
    education: [
      {
        institution: 'Tech University',
        department: 'Data Science',
        degree: 'Master',
        startMonth: 9,
        startYear: 2017,
        endMonth: 6,
        endYear: 2019,
        ongoing: false,
      },
    ],
  },
  {
    id: '3',
    userId: 'user-3',
    fullName: 'Bob Johnson',
    permission: ModeratorPermission.Moderator,
    employment: [
      {
        title: 'Engineer',
        institution: 'State University',
        department: 'Engineering',
        startMonth: 6,
        startYear: 2018,
        endMonth: 12,
        endYear: 2022,
        ongoing: false,
      },
    ],
    education: [
      {
        institution: 'State University',
        department: 'Engineering',
        degree: 'Bachelor',
        startMonth: 9,
        startYear: 2014,
        endMonth: 6,
        endYear: 2018,
        ongoing: false,
      },
    ],
  },
];
