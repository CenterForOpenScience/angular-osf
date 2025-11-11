import { BaseNodeMapper } from '@osf/shared/mappers/nodes';
import { BaseNodeDataJsonApi } from '@osf/shared/models/nodes/base-node-data-json-api.model';

import { ProjectOverviewModel } from '../models';

export class ProjectOverviewMapper {
  static getProjectOverview(data: BaseNodeDataJsonApi): ProjectOverviewModel {
    const nodeAttributes = BaseNodeMapper.getNodeData(data);
    const relationships = data.relationships;

    return {
      ...nodeAttributes,
      rootParentId: relationships?.root?.data?.id,
      parentId: relationships?.parent?.data?.id,
      forksCount: relationships.forks?.links?.related?.meta
        ? (relationships.forks?.links?.related?.meta['count'] as number)
        : 0,
      viewOnlyLinksCount: relationships.view_only_links?.links?.related?.meta
        ? (relationships.view_only_links?.links?.related?.meta['count'] as number)
        : 0,
      links: {
        iri: data.links?.iri,
      },
      licenseId: relationships.license?.data?.id,
    };
  }
}
