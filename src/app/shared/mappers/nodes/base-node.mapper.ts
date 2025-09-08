import { BaseNodeDataJsonApi, BaseNodeModel, NodeShortInfoModel } from '@osf/shared/models';

export class BaseNodeMapper {
  static getNodesData(data: BaseNodeDataJsonApi[]): BaseNodeModel[] {
    return data.map((item) => this.getNodeData(item));
  }

  static getNodesWithChildren(data: BaseNodeDataJsonApi[]): NodeShortInfoModel[] {
    return data.map((item) => ({
      id: item.id,
      title: item.attributes.title,
      parentId: item.relationships.parent?.data?.id,
    }));
  }

  static getNodeData(data: BaseNodeDataJsonApi): BaseNodeModel {
    return {
      id: data.id,
      title: data.attributes.title,
      description: data.attributes.description,
      category: data.attributes.category,
      dateCreated: data.attributes.date_created,
      dateModified: data.attributes.date_modified,
      isRegistration: data.attributes.registration,
      isPreprint: data.attributes.preprint,
      isFork: data.attributes.fork,
      isCollection: data.attributes.collection,
      isPublic: data.attributes.public,
      tags: data.attributes.tags || [],
      accessRequestsEnabled: data.attributes.access_requests_enabled,
      nodeLicense: {
        copyrightHolders: data.attributes.node_license?.copyright_holders || null,
        year: data.attributes.node_license?.year || null,
      },
      currentUserPermissions: data.attributes.current_user_permissions || [],
      currentUserIsContributor: data.attributes.current_user_is_contributor,
      wikiEnabled: data.attributes.wiki_enabled,
      customCitation: data.attributes.custom_citation || undefined,
    };
  }
}
