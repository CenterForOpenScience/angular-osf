import { CITATION_TITLES } from '@shared/constants';
import { CitationTypes } from '@shared/enums';
import { DefaultCitation, DefaultCitationJsonApi } from '@shared/models';

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
}
