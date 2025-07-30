import { LinkedNode, LinkedNodeJsonApi } from '../models';

export class LinkedNodesMapper {
  static fromApiResponse(apiNode: LinkedNodeJsonApi): LinkedNode {
    return {
      id: apiNode.id,
      title: apiNode.attributes.title,
      description: apiNode.attributes.description,
      category: apiNode.attributes.category,
      dateCreated: apiNode.attributes.date_created,
      dateModified: apiNode.attributes.date_modified,
      tags: apiNode.attributes.tags || [],
      isPublic: apiNode.attributes.public,
      htmlUrl: apiNode.links.html,
      apiUrl: apiNode.links.self,
    };
  }
}
