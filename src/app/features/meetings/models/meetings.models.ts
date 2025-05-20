export interface Meeting {
  id: string;
  title: string;
  submissionsCount: number;
  location: string;
  startDate: Date;
  endDate: Date;
}

export interface MeetingSubmission {
  id: string;
  title: string;
  dateCreated: Date;
  authorName: string;
  downloadCount: number;
  meetingCategory: string;
  downloadLink: string;
}
