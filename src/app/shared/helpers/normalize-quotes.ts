import { StringOrNull } from '@shared/helpers/types.helper';

export function normalizeQuotes(text: StringOrNull): StringOrNull {
  return text?.replace(/[\u201C\u201D]/g, '"') ?? null;
}
