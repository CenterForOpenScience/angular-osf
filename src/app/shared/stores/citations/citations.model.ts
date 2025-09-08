import { AsyncStateModel, CitationStyle, DefaultCitation, StyledCitation } from '@osf/shared/models';

export interface CitationsStateModel {
  defaultCitations: AsyncStateModel<DefaultCitation[]>;
  citationStyles: AsyncStateModel<CitationStyle[]>;
  styledCitation: AsyncStateModel<StyledCitation | null>;
  customCitation: AsyncStateModel<string>;
}

export const CITATIONS_DEFAULTS: CitationsStateModel = {
  defaultCitations: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  citationStyles: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  styledCitation: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  customCitation: {
    data: '',
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
};
