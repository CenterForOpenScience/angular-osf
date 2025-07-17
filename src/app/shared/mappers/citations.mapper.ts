import { CITATION_TITLES } from '@shared/constants';
import { CitationTypes } from '@shared/enums';
import { CitationStyle, CitationStylesJsonApiResponse, DefaultCitation, DefaultCitationJsonApi } from '@shared/models';

export class CitationsMapper {
  static fromGetDefaultResponse(response: DefaultCitationJsonApi): DefaultCitation {
    const citationId = response.data.id;

    return {
      id: citationId,
      type: response.data.type,
      citation: response.data.attributes.citation,
      title: CITATION_TITLES[citationId as CitationTypes],
    };
  }

  static fromGetCitationStylesResponse(response: CitationStylesJsonApiResponse): CitationStyle[] {
    return response.styles.map((style) => ({
      id: style.id,
      title: style.title,
      shortTitle: style.short_title,
      summary: style.summary,
      hasBibliography: style.has_bibliography,
      parentStyle: style.parent_style,
    }));
  }
}
