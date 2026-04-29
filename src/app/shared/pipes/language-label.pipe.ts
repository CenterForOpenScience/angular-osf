import { Pipe, PipeTransform } from '@angular/core';

import { LANGUAGE_CODES } from '@osf/shared/constants/language.const';

const languageLabelByCode = new Map(LANGUAGE_CODES.map((item) => [item.code, item.name]));

@Pipe({
  name: 'languageLabel',
})
export class LanguageLabelPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return languageLabelByCode.get(value) ?? value;
  }
}
