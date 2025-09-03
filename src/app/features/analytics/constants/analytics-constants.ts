import { DateRange } from '../enums';
import { DateRangeOption } from '../models';

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { label: 'project.analytics.charts.pastWeek', value: DateRange.PastWeek },
  { label: 'project.analytics.charts.pastTwoWeeks', value: DateRange.PastTwoWeeks },
  { label: 'project.analytics.charts.pastMonth', value: DateRange.PastMonth },
];
