import { Pipe, PipeTransform } from '@angular/core';

import { RESOURCE_TYPE_GENERAL_OPTIONS } from '@osf/shared/constants/resource-type-general-options.const';

const resourceTypeGeneralLabelByValue = new Map(RESOURCE_TYPE_GENERAL_OPTIONS.map((item) => [item.value, item.label]));

@Pipe({
  name: 'resourceTypeGeneralLabel',
})
export class ResourceTypeGeneralLabelPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return resourceTypeGeneralLabelByValue.get(value) ?? value;
  }
}
