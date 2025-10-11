import { Pipe, PipeTransform } from '@angular/core';

import { DateSortable } from '../models';

@Pipe({
  name: 'sortByDate',
  standalone: true,
})
export class SortByDatePipe implements PipeTransform {
  transform<T extends DateSortable>(items: T[] | null | undefined): T[] {
    if (!items || items.length === 0) return [];

    return [...items].sort((a, b) => {
      if (a.startYear !== b.startYear) {
        return b.startYear - a.startYear;
      }
      return b.startMonth - a.startMonth;
    });
  }
}
