import { NodePreprintModel } from '@osf/shared/models/nodes/node-preprint.model';
import { NodePreprintDataJsonApi } from '@osf/shared/models/nodes/node-preprint-json-api.model';

export class NodePreprintMapper {
  static getNodePreprint(data: NodePreprintDataJsonApi): NodePreprintModel {
    return {
      id: data.id,
      title: data.attributes.title,
      dateCreated: data.attributes.date_created,
      dateModified: data.attributes.date_modified,
      datePublished: data.attributes.date_published,
      doi: data.attributes.doi,
      isPreprintOrphan: data.attributes.is_preprint_orphan,
      isPublished: data.attributes.is_published,
      url: data.links.html,
    };
  }

  static getNodePreprints(data: NodePreprintDataJsonApi[]): NodePreprintModel[] {
    if (!data) {
      return [];
    }

    return data.map((item) => this.getNodePreprint(item));
  }
}
