import {
  PaginatedViewOnlyLinksModel,
  ViewOnlyLinkModel,
  ViewOnlyLinkNodeModel,
} from '../models/view-only-links/view-only-link.model';
import {
  ViewOnlyLinkJsonApi,
  ViewOnlyLinksResponseJsonApi,
} from '../models/view-only-links/view-only-link-response.model';

import { UserMapper } from './user';

export class ViewOnlyLinksMapper {
  static fromResponse(response: ViewOnlyLinksResponseJsonApi, projectId: string): PaginatedViewOnlyLinksModel {
    const items: ViewOnlyLinkModel[] = response.data.map((item) => {
      const creator = UserMapper.getUserInfo(item.embeds.creator);

      return {
        id: item.id,
        link: `${document.baseURI}${projectId}/overview?view_only=${item.attributes.key}`,
        dateCreated: item.attributes.date_created,
        key: item.attributes.key,
        name: item.attributes.name,
        anonymous: item.attributes.anonymous,
        creator: {
          id: creator?.id || '',
          fullName: creator?.fullName || '',
        },
        nodes: item.embeds?.nodes?.data?.map(
          (node) =>
            ({
              id: node.id,
              title: node.attributes.title,
              category: node.attributes.category,
            }) as ViewOnlyLinkNodeModel
        ),
      } as ViewOnlyLinkModel;
    });

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
    const creator = UserMapper.getUserInfo(item.embeds.creator);

    const mappedItem: ViewOnlyLinkModel = {
      id: item.id,
      link: `${document.baseURI}${projectId}/overview?view_only=${item.attributes.key}`,
      dateCreated: item.attributes.date_created,
      key: item.attributes.key,
      name: item.attributes.name,
      anonymous: item.attributes.anonymous,
      creator: {
        id: creator?.id || '',
        fullName: creator?.fullName || '',
      },
      nodes: item.embeds?.nodes?.data?.map(
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
