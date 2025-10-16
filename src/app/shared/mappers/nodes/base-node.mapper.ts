import {
  BaseNodeDataJsonApi,
  BaseNodeModel,
  NodeModel,
  NodeShortInfoModel,
  PaginatedData,
  ResponseJsonApi,
} from '@osf/shared/models';
import { ContributorsMapper } from '@shared/mappers';

export class BaseNodeMapper {
  static getNodesData(data: BaseNodeDataJsonApi[]): BaseNodeModel[] {
    return data.map((item) => this.getNodeData(item));
  }

  static getNodesWithEmbedsData(data: BaseNodeDataJsonApi[]): NodeModel[] {
    return data.map((item) => this.getNodeWithEmbedsData(item));
  }

  static getNodesWithEmbedsAndTotalData(response: ResponseJsonApi<BaseNodeDataJsonApi[]>): PaginatedData<NodeModel[]> {
    return {
      data: BaseNodeMapper.getNodesWithEmbedsData(response.data),
      totalCount: response.meta.total,
      pageSize: response.meta.per_page,
    };
  }

  static getNodesWithChildren(data: BaseNodeDataJsonApi[], parentId: string): NodeShortInfoModel[] {
    return this.getAllDescendants(data, parentId).map((item) => ({
      id: item.id,
      title: item.attributes.title,
      isPublic: item.attributes.public,
      permissions: item.attributes.current_user_permissions,
      parentId: item.relationships.parent?.data?.id,
    }));
  }

  static getNodeData(data: BaseNodeDataJsonApi): BaseNodeModel {
    return {
      id: data.id,
      type: data.type,
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
      rootParentId: data.relationships.root?.data?.id,
    };
  }

  static getNodeWithEmbedsData(data: BaseNodeDataJsonApi): NodeModel {
    const baseNode = BaseNodeMapper.getNodeData(data);
    return {
      ...baseNode,
      bibliographicContributors: ContributorsMapper.getContributors(data.embeds?.bibliographic_contributors?.data),
    };
  }

  static getAllDescendants(allNodes: BaseNodeDataJsonApi[], parentId: string): BaseNodeDataJsonApi[] {
    const parent = allNodes.find((n) => n.id === parentId);
    if (!parent) return [];

    const directChildren = allNodes.filter((node) => node.relationships.parent?.data?.id === parentId);

    const descendants = directChildren.flatMap((child) => this.getAllDescendants(allNodes, child.id));

    return [parent, ...descendants];
  }
}
