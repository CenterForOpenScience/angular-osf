export interface NodeLinkJsonApi {
  relationships: {
    target_node: {
      data: {
        id: string;
        type: string;
      };
    };
  };
  id: string;
  type: string;
}
