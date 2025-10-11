import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixSpecialChar',
  standalone: true,
})
export class FixSpecialCharPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    return value.replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
  }
}
