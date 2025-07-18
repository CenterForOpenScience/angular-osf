export interface CustomCitationPayloadJsonApi {
  data: {
    id: string;
    type: string;
    attributes: { custom_citation: string };
  };
}
