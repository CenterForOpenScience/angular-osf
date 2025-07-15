export interface DefaultCitationJsonApi {
  data: {
    id: string;
    type: string;
    attributes: {
      citation: string;
    };
  };
}
