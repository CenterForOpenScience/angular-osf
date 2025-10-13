import { Meeting, MeetingSubmission } from '@osf/features/meetings/models';

export const MOCK_MEETING: Meeting = {
  id: '1',
  name: 'Test Meeting',
  submissionsCount: 10,
  location: 'New York',
  startDate: new Date('2024-01-15'),
  endDate: new Date('2024-01-16'),
};

export const MOCK_MEETING_SUBMISSIONS: MeetingSubmission[] = [
  {
    id: '1',
    title: 'The Impact of Open Science on Research Collaboration',
    authorName: 'John Doe',
    meetingCategory: 'Open Science',
    dateCreated: new Date('2024-01-15'),
    downloadCount: 5,
    downloadLink: 'https://example.com/file.pdf',
  },
  {
    id: '2',
    title: "'Data Sharing Practices in Modern Biology",
    authorName: 'Jane Smith',
    meetingCategory: 'Biology',
    dateCreated: new Date('2024-01-19'),
    downloadCount: 0,
    downloadLink: null,
  },
];
