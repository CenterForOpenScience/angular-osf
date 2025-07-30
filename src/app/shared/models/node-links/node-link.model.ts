export interface NodeLink {
  type: string;
  id: string;
  targetNode: {
    id: string;
    type: string;
  };
}
