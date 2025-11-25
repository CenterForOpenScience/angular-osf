import { TranslateService } from '@ngx-translate/core';

import { UserMapper } from '@osf/shared/mappers/user/user.mapper';
import {
  ComponentsWikiGetResponse,
  HomeWiki,
  HomeWikiGetResponse,
  WikiGetResponse,
  WikiModel,
  WikiVersion,
  WikiVersionJsonApi,
} from '@osf/shared/models/wiki/wiki.model';
import { ComponentWiki } from '@osf/shared/stores/wiki';

export class WikiMapper {
  private static translate: TranslateService;

  static init(translate: TranslateService): void {
    WikiMapper.translate = translate;
  }

  static fromCreateWikiResponse(response: WikiGetResponse): WikiModel {
    return {
      id: response.id,
      name: response.attributes.name,
      kind: response.attributes.kind,
    };
  }

  static fromGetHomeWikiResponse(response: HomeWikiGetResponse): HomeWiki {
    return {
      id: response.id,
      name: response.attributes.name,
      contentType: response.attributes.content_type,
      downloadLink: response.links.download,
    };
  }

  static fromGetWikiResponse(response: WikiGetResponse): WikiModel {
    return {
      id: response.id,
      name: response.attributes.name,
      kind: response.attributes.kind,
    };
  }

  static fromGetComponentsWikiResponse(response: ComponentsWikiGetResponse): ComponentWiki {
    return {
      id: response.id,
      title: response.attributes.title,
      list: response.embeds?.wikis?.data.map((wiki) => WikiMapper.fromGetWikiResponse(wiki)) || [],
    };
  }

  static fromGetWikiVersionResponse(response: WikiVersionJsonApi): WikiVersion {
    return {
      id: response.id,
      createdAt: response.attributes.date_created,
      createdBy:
        UserMapper.getUserInfo(response.embeds.user)?.fullName ||
        WikiMapper.translate.instant('project.wiki.version.unknownAuthor'),
    };
  }

  static fromCreateWikiVersionResponse(response: WikiGetResponse): WikiModel {
    return {
      id: response.id,
      name: response.attributes.name,
      kind: response.attributes.kind,
    };
  }
}
