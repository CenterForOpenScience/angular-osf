import { CitationTypes } from '@shared/enums';

export const CITATION_TITLES: Record<CitationTypes, string> = {
  [CitationTypes.APA]: 'APA',
  [CitationTypes.MLA]: 'MLA',
  [CitationTypes.CHICAGO]: 'Chicago',
};
