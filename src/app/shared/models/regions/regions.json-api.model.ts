export interface RegionsResponseJsonApi {
  data: {
    id: string;
    type: 'regions';
    attributes: {
      name: string;
    };
  }[];
}
