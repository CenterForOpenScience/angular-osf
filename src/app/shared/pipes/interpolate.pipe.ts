import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'interpolate',
})
export class InterpolatePipe implements PipeTransform {
  transform(template: string, variables: Record<string, string | null>): string {
    return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => (variables[key] != null ? variables[key] : ''));
  }
}
