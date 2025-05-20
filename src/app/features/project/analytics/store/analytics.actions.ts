import { DateRange } from '../enums';

export class GetMetrics {
  static readonly type = '[Analytics] Get Metrics';

  constructor(
    public projectId: string,
    public dateRange: DateRange
  ) {}
}

export class GetRelatedCounts {
  static readonly type = '[Analytics] Get Related Counts';

  constructor(public projectId: string) {}
}
