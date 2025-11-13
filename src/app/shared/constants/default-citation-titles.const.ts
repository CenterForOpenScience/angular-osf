import { CitationTypes } from '../enums/citation-types.enum';

export const CITATION_TITLES: Record<CitationTypes, string> = {
  [CitationTypes.APA]: 'APA',
  [CitationTypes.MLA]: 'MLA',
  [CitationTypes.CHICAGO]: 'Chicago',
};
