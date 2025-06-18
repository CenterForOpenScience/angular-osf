import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decodeHtml',
})
export class DecodeHtmlPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    return value.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }
}
