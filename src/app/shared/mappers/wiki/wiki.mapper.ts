import { UserMapper } from '@osf/shared/mappers/user/user.mapper';
import { BaseNodeDataJsonApi } from '@osf/shared/models/nodes/base-node-data-json-api.model';
import { HomeWiki, WikiModel, WikiVersion } from '@osf/shared/models/wiki/wiki.model';
import { WikiDataJsonApi, WikiVersionJsonApi } from '@osf/shared/models/wiki/wiki-json-api.model';
import { ComponentWiki } from '@osf/shared/stores/wiki';
import { replaceBadEncodedChars } from '@shared/helpers/format-bad-encoding.helper';

export class WikiMapper {
  static fromGetHomeWikiResponse(response: WikiDataJsonApi): HomeWiki {
    return {
      id: response.id,
      name: response.attributes.name,
      contentType: response.attributes.content_type,
      downloadLink: response.links.download,
    };
  }

  static fromGetWikiResponse(response: WikiDataJsonApi): WikiModel {
    return {
      id: response.id,
      name: response.attributes.name,
      kind: response.attributes.kind,
    };
  }

  static fromGetComponentsWikiResponse(response: BaseNodeDataJsonApi): ComponentWiki {
    return {
      id: response.id,
      title: replaceBadEncodedChars(response.attributes.title),
      list: response.embeds?.wikis?.data.map((wiki) => WikiMapper.fromGetWikiResponse(wiki)) || [],
    };
  }

  static fromGetWikiVersionResponse(response: WikiVersionJsonApi): WikiVersion {
    return {
      id: response.id,
      createdAt: response.attributes.date_created,
      createdBy: UserMapper.getUserInfo(response.embeds.user)?.fullName,
    };
  }

  static fromCreateWikiVersionResponse(response: WikiDataJsonApi): WikiModel {
    return {
      id: response.id,
      name: response.attributes.name,
      kind: response.attributes.kind,
    };
  }
}
