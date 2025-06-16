export interface CreateProjectPayloadJsoApi {
  data: {
    type: 'nodes';
    attributes: {
      title: string;
      description?: string;
      category: 'project';
      template_from?: string;
    };
    relationships: {
      region: {
        data: {
          type: 'regions';
          id: string;
        };
      };
      affiliated_institutions?: {
        data: {
          type: 'institutions';
          id: string;
        }[];
      };
    };
  };
}
