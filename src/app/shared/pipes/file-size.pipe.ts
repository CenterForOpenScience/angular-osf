import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
})
export class FileSizePipe implements PipeTransform {
  transform(bytes: number): string {
    if (!bytes) {
      return '';
    } else if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 ** 2) {
      return `${(bytes / 1024).toFixed(1)} kB`;
    } else if (bytes < 1024 ** 3) {
      return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    } else {
      return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
    }
  }
}
