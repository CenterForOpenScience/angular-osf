import { NodeLink, NodeLinkJsonApi } from '@shared/models/node-links';

export class NodeLinksMapper {
  static fromNodeLinkResponse(response: NodeLinkJsonApi): NodeLink {
    return {
      type: response.type,
      id: response.id,
      targetNode: {
        type: response.relationships.target_node.data.type,
        id: response.relationships.target_node.data.id,
      },
    };
  }
}
