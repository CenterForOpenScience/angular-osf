import { SearchFilters } from '@shared/models/filters';

export class GetAllMeetings {
  static readonly type = '[Meetings] Get All';

  constructor(
    public pageNumber: number,
    public pageSize: number,
    public filters: SearchFilters
  ) {}
}

export class GetMeetingById {
  static readonly type = '[Meetings] Get Meeting By Id';

  constructor(public meetingId: string) {}
}

export class GetMeetingSubmissions {
  static readonly type = '[Meetings] Get Meeting Submissions';

  constructor(
    public meetingId: string,
    public pageNumber: number,
    public pageSize: number,
    public filters: SearchFilters
  ) {}
}
