import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo',
})
export class DateAgoPipe implements PipeTransform {
  private readonly formatter = new Intl.RelativeTimeFormat('en', {
    numeric: 'auto',
    style: 'long',
  });

  private readonly units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];

  transform(value: string | Date | number): string {
    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Invalid date';

    const seconds = (date.getTime() - Date.now()) / 1000;

    for (const [unit, secondsInUnit] of this.units) {
      if (Math.abs(seconds) >= secondsInUnit || unit === 'second') {
        return this.formatter.format(Math.round(seconds / secondsInUnit), unit);
      }
    }

    return 'just now';
  }
}
