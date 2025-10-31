import { CITATION_TITLES } from '../constants/default-citation-titles.const';
import { CitationTypes } from '../enums/citation-types.enum';
import { CitationStyle } from '../models/citations/citation-style.model';
import { CitationStyleJsonApi } from '../models/citations/citation-style-json-api.model';
import { CustomCitationPayload } from '../models/citations/custom-citation-payload.model';
import { CustomCitationPayloadJsonApi } from '../models/citations/custom-citation-payload-json-api.model';
import { StyledCitation } from '../models/citations/styled-citation.model';
import { StyledCitationJsonApi } from '../models/citations/styled-citation-json-api.model';

export class CitationsMapper {
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
      title: CITATION_TITLES[response.id as CitationTypes],
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
