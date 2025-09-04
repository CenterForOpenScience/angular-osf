import {
  PaginatedViewOnlyLinksModel,
  ViewOnlyLinkJsonApi,
  ViewOnlyLinkModel,
  ViewOnlyLinkNodeModel,
  ViewOnlyLinksResponseJsonApi,
} from '../models';

export class ViewOnlyLinksMapper {
  static fromResponse(response: ViewOnlyLinksResponseJsonApi, projectId: string): PaginatedViewOnlyLinksModel {
    const items: ViewOnlyLinkModel[] = response.data.map((item) => ({
      id: item.id,
      link: `${document.baseURI}${projectId}/overview?view_only=${item.attributes.key}`,
      dateCreated: item.attributes.date_created,
      key: item.attributes.key,
      name: item.attributes.name,
      anonymous: item.attributes.anonymous,
      creator: {
        id: item.embeds.creator.data.id,
        fullName: item.embeds.creator.data.attributes.full_name ?? '',
      },
      nodes: item.embeds.nodes.data.map(
        (node) =>
          ({
            id: node.id,
            title: node.attributes.title,
            category: node.attributes.category,
          }) as ViewOnlyLinkNodeModel
      ),
    }));

    return {
      items,
      total: response.meta.total,
      perPage: response.meta.per_page,
      next: response.links.next,
      prev: response.links.prev,
    };
  }

  static fromSingleResponse(response: ViewOnlyLinkJsonApi, projectId: string): PaginatedViewOnlyLinksModel {
    const item = response;

    const mappedItem: ViewOnlyLinkModel = {
      id: item.id,
      link: `${document.baseURI}${projectId}/overview?view_only=${item.attributes.key}`,
      dateCreated: item.attributes.date_created,
      key: item.attributes.key,
      name: item.attributes.name,
      anonymous: item.attributes.anonymous,
      creator: {
        id: item.embeds.creator.data.id,
        fullName: item.embeds.creator.data.attributes.full_name,
      },
      nodes: item.embeds.nodes.data.map(
        (node) =>
          ({
            id: node.id,
            title: node.attributes.title,
            category: node.attributes.category,
          }) as ViewOnlyLinkNodeModel
      ),
    };

    return {
      items: [mappedItem],
      total: 1,
      perPage: 1,
      next: null,
      prev: null,
    };
  }
}
