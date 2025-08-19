import { TranslateService } from '@ngx-translate/core';

import { PreprintProviderDetails, PreprintWordGrammar } from '../models';

export function getPreprintDocumentType(
  provider: PreprintProviderDetails,
  translateService: TranslateService
): Record<PreprintWordGrammar, string> {
  const key = `preprints.documentType.${provider.preprintWord}`;

  return {
    plural: translateService.instant(`${key}.plural`),
    pluralCapitalized: translateService.instant(`${key}.pluralCapitalized`),
    singular: translateService.instant(`${key}.singular`),
    singularCapitalized: translateService.instant(`${key}.singularCapitalized`),
  };
}
