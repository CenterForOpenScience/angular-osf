import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = day * 365;

    if (seconds < minute) {
      return seconds === 0 ? 'just now' : `${seconds} seconds ago`;
    } else if (seconds < hour) {
      const minutes = Math.floor(seconds / minute);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (seconds < day) {
      const hours = Math.floor(seconds / hour);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (seconds < month) {
      const days = Math.floor(seconds / day);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (seconds < year) {
      const months = Math.floor(seconds / month);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(seconds / year);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  }
}
