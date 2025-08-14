import { CITATION_TITLES } from '../constants';
import { CitationTypes } from '../enums';
import {
  CitationStyle,
  CitationStyleJsonApi,
  CustomCitationPayload,
  CustomCitationPayloadJsonApi,
  DefaultCitation,
  DefaultCitationJsonApi,
  StyledCitation,
  StyledCitationJsonApi,
} from '../models';

export class CitationsMapper {
  static fromGetDefaultResponse(response: DefaultCitationJsonApi): DefaultCitation {
    const citationId = response.id;

    return {
      id: citationId,
      type: response.type,
      citation: response.attributes.citation,
      title: CITATION_TITLES[citationId as CitationTypes],
    };
  }

  static fromGetCitationStylesResponse(response: CitationStyleJsonApi[]): CitationStyle[] {
    return response.map((style) => ({
      id: style.id,
      type: style.type,
      title: style.attributes.title,
      shortTitle: style.attributes.short_title,
      summary: style.attributes.summary,
      dateParsed: style.attributes.date_parsed,
    }));
  }

  static fromGetStyledCitationResponse(response: StyledCitationJsonApi): StyledCitation {
    return {
      id: response.id,
      type: response.type,
      citation: response.attributes.citation,
    };
  }

  static toUpdateCustomCitationRequest(payload: CustomCitationPayload): CustomCitationPayloadJsonApi {
    return {
      data: {
        id: payload.id,
        type: payload.type,
        attributes: {
          custom_citation: payload.citationText,
        },
      },
    };
  }
}
