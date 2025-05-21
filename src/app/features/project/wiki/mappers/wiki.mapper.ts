import { HomeWiki, HomeWikiGetResponse } from '../models/wiki.model';

export class WikiMapper {
  static fromGetHomeWikiResponse(response: HomeWikiGetResponse): HomeWiki {
    return {
      id: response.id,
      name: response.attributes.name,
      contentType: response.attributes.content_type,
      downloadLink: response.links.download,
    };
  }
}
