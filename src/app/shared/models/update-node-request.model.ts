export interface UpdateNodeAttributes {
  description?: string;
  tags?: string[];
  public?: boolean;
  title?: string;
}

export interface UpdateNodeData {
  type: 'nodes';
  id: string;
  attributes: UpdateNodeAttributes;
}

export interface UpdateNodeRequestModel {
  data: UpdateNodeData;
}
