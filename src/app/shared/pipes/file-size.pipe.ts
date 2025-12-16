import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
})
export class FileSizePipe implements PipeTransform {
  private readonly SI_UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  private readonly BINARY_UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  transform(bytes: number | null | undefined, si = true): string {
    if (bytes == null) return '0 B';

    const threshold = si ? 1000 : 1024;
    const units = si ? this.SI_UNITS : this.BINARY_UNITS;
    const absBytes = Math.abs(bytes);

    if (absBytes < threshold) {
      return `${bytes} B`;
    }

    const exponent = Math.min(Math.floor(Math.log(absBytes) / Math.log(threshold)), units.length - 1);

    const value = bytes / Math.pow(threshold, exponent);

    return `${value.toFixed(1)} ${units[exponent]}`;
  }
}
