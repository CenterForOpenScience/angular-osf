import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms a report yearmonth string from "YYYY-MM" format to "Month Day, Year" format
 * Example: "2024-08" -> "August 1, 2024"
 */
@Pipe({
  name: 'reportDate',
  standalone: true,
})
export class ReportDatePipe implements PipeTransform {
  private readonly monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  transform(yearMonth: string | null | undefined): string {
    if (!yearMonth) {
      return '';
    }

    // Input format: "YYYY-MM" (e.g., "2024-08")
    const [yearStr, monthStr] = yearMonth.split('-');

    if (!yearStr || !monthStr) {
      return '';
    }

    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return '';
    }

    const monthName = this.monthNames[month - 1];

    // Output format: "Month 1, Year" (e.g., "August 1, 2024")
    return `${monthName} 1, ${year}`;
  }
}
