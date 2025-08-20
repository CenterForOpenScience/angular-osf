import { MetaTagAuthor } from './meta-tag-author.model';

export type Content = string | number | null | undefined | MetaTagAuthor;

export type DataContent = Content | Content[];

export interface MetaTagsData {
  title?: DataContent;
  type?: DataContent;
  description?: DataContent;
  url?: DataContent;
  doi?: DataContent;
  identifier?: DataContent;
  publishedDate?: DataContent;
  modifiedDate?: DataContent;
  license?: DataContent;
  language?: DataContent;
  image?: DataContent;
  imageType?: DataContent;
  imageWidth?: DataContent;
  imageHeight?: DataContent;
  imageAlt?: DataContent;
  siteName?: DataContent;
  institution?: DataContent;
  fbAppId?: DataContent;
  twitterSite?: DataContent;
  twitterCreator?: DataContent;
  contributors?: DataContent;
  keywords?: DataContent;
}
