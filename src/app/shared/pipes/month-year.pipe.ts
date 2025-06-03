import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthYear',
})
export class MonthYearPipe implements PipeTransform {
  transform(month: number | null, year: number | null): string {
    if (!month || !year) return '';

    const date = new Date(year, month - 1, 1);

    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }
}
