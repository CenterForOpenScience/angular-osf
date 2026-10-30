import { DateRange } from '../enums/date-range.enum';
import { DateRangeOption } from '../models/date-range-option.model';

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { label: 'project.analytics.charts.pastWeek', value: DateRange.PastWeek },
  { label: 'project.analytics.charts.pastTwoWeeks', value: DateRange.PastTwoWeeks },
  { label: 'project.analytics.charts.pastMonth', value: DateRange.PastMonth },
];
