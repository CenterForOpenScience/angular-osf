import { CitationStyle, DefaultCitation, StyledCitation } from '@shared/models';
import { AsyncStateModel } from '@shared/models/store';

export interface CitationsStateModel {
  defaultCitations: AsyncStateModel<DefaultCitation[]>;
  citationStyles: AsyncStateModel<CitationStyle[]>;
  styledCitation: AsyncStateModel<StyledCitation | null>;
  customCitation: AsyncStateModel<string>;
}
