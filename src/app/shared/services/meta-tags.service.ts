import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

import { Content, DataContent, HeadTagDef, MetaTagAuthor, MetaTagsData } from '../models/meta-tags';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetaTagsService {
  private readonly defaultMetaTags: MetaTagsData = {
    type: 'article',
    description: 'Hosted on the OSF',
    language: 'en-US',
    image: `${environment.webUrl}/static/img/preprints_assets/osf/sharing.png`,
    imageType: 'image/png',
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: 'OSF',
    siteName: 'OSF',
    institution: 'Center for Open Science',
    fbAppId: environment.facebookAppId,
    twitterSite: environment.twitterHandle,
    twitterCreator: environment.twitterHandle,
  };

  private readonly metaTagClass = 'osf-dynamic-meta';
  private currentRouteGroup: string | null = null;

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document
  ) {}

  updateMetaTags(metaTagsData: MetaTagsData): void {
    const combinedData = { ...this.defaultMetaTags, ...metaTagsData };
    const headTags = this.getHeadTags(combinedData);

    this.applyHeadTags(headTags);
    this.dispatchZoteroEvent();
  }

  updateMetaTagsForRoute(metaTagsData: MetaTagsData, routeGroup: string): void {
    this.currentRouteGroup = routeGroup;
    this.updateMetaTags(metaTagsData);
  }

  clearMetaTags(): void {
    const elementsToRemove = this.document.querySelectorAll(`.${this.metaTagClass}`);

    if (elementsToRemove.length === 0) {
      return;
    }

    elementsToRemove.forEach((element) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });

    this.title.setTitle(String(this.defaultMetaTags.siteName));
    this.currentRouteGroup = null;
  }

  shouldClearMetaTags(newUrl: string): boolean {
    if (!this.currentRouteGroup) return true;
    return !newUrl.startsWith(`/${this.currentRouteGroup}`);
  }

  clearMetaTagsIfNeeded(newUrl: string): void {
    if (this.shouldClearMetaTags(newUrl)) {
      this.clearMetaTags();
    }
  }

  resetToDefaults(): void {
    this.updateMetaTags({});
  }

  getHeadTagsPublic(metaTagsData: MetaTagsData): HeadTagDef[] {
    const combinedData = { ...this.defaultMetaTags, ...metaTagsData };
    return this.getHeadTags(combinedData);
  }

  private getHeadTags(metaTagsData: MetaTagsData): HeadTagDef[] {
    const headTags: HeadTagDef[] = [];

    const identifiers = this.toArray(metaTagsData.url)
      .concat(this.toArray(metaTagsData.doi))
      .concat(this.toArray(metaTagsData.identifier));

    const metaTagsDefs = {
      // Citation
      citation_title: metaTagsData.title,
      citation_doi: metaTagsData.doi,
      citation_publisher: metaTagsData.siteName,
      citation_author_institution: metaTagsData.institution,
      citation_author: metaTagsData.contributors,
      citation_description: metaTagsData.description,
      citation_public_url: metaTagsData.url,
      citation_publication_date: metaTagsData.publishedDate,

      // Dublin Core
      'dct.title': metaTagsData.title,
      'dct.type': metaTagsData.type,
      'dct.identifier': identifiers,
      'dct.abstract': metaTagsData.description,
      'dct.license': metaTagsData.license,
      'dct.modified': metaTagsData.modifiedDate,
      'dct.created': metaTagsData.publishedDate,
      'dc.publisher': metaTagsData.siteName,
      'dc.language': metaTagsData.language,
      'dc.contributor': metaTagsData.contributors,
      'dc.subject': metaTagsData.keywords,

      // Open Graph/Facebook
      'fb:app_id': metaTagsData.fbAppId,
      'og:ttl': 345600,
      'og:title': metaTagsData.title,
      'og:type': metaTagsData.type,
      'og:site_name': metaTagsData.siteName,
      'og:url': metaTagsData.url,
      'og:secure_url': metaTagsData.url,
      'og:description': metaTagsData.description,
      'og:image': metaTagsData.image,
      'og:image:type': metaTagsData.imageType,
      'og:image:width': metaTagsData.imageWidth,
      'og:image:height': metaTagsData.imageHeight,
      'og:image:alt': metaTagsData.imageAlt,

      // Twitter
      'twitter:card': 'summary',
      'twitter:site': metaTagsData.twitterSite,
      'twitter:creator': metaTagsData.twitterCreator,
      'twitter:title': metaTagsData.title,
      'twitter:description': metaTagsData.description,
      'twitter:image': metaTagsData.image,
      'twitter:image:alt': metaTagsData.imageAlt,
    };

    const metaTagsHeadTags = Object.entries(metaTagsDefs)
      .reduce((acc: HeadTagDef[], [name, content]) => {
        if (content) {
          const contentArray = this.toArray(content);
          return acc.concat(
            contentArray
              .filter((contentItem) => contentItem)
              .map((contentItem) => ({
                type: 'meta' as const,
                attrs: this.makeMetaTagAttrs(name, this.buildMetaTagContent(name, contentItem)),
              }))
          );
        }
        return acc;
      }, [])
      .filter((tag) => tag.attrs.content);

    headTags.push(...metaTagsHeadTags);

    if (metaTagsData.contributors) {
      headTags.push(this.buildPersonScriptTag(metaTagsData.contributors));
    }

    return headTags;
  }

  private buildPersonScriptTag(contributors: DataContent): HeadTagDef {
    const contributorArray = this.toArray(contributors);
    const contributor = contributorArray
      .filter((person): person is MetaTagAuthor => typeof person === 'object' && person !== null)
      .map((person) => ({
        '@type': 'schema:Person',
        givenName: person.givenName,
        familyName: person.familyName,
      }));

    return {
      type: 'script',
      content: JSON.stringify({
        '@context': {
          dc: 'http://purl.org/dc/elements/1.1/',
          schema: 'http://schema.org',
        },
        '@type': 'schema:CreativeWork',
        contributor,
      }),
      attrs: {
        type: 'application/ld+json',
      },
    };
  }

  private buildMetaTagContent(name: string, content: Content): Content {
    if (['citation_author', 'dc.contributor'].includes(name) && typeof content === 'object') {
      const author = content as MetaTagAuthor;
      return `${author.familyName}, ${author.givenName}`;
    }
    return content;
  }

  private makeMetaTagAttrs(name: string, content: Content): MetaDefinition {
    if (['fb:', 'og:'].includes(name.substring(0, 3))) {
      return { property: name, content: String(content), class: this.metaTagClass };
    }
    return { name, content: String(content), class: this.metaTagClass } as MetaDefinition;
  }

  private toArray(content: DataContent): Content[] {
    return Array.isArray(content) ? content : [content];
  }

  private applyHeadTags(headTags: HeadTagDef[]): void {
    headTags.forEach((tag) => {
      if (tag.type === 'meta') {
        this.meta.addTag(tag.attrs);
      } else if (tag.type === 'link') {
        const link = this.document.createElement('link');
        link.className = this.metaTagClass;
        Object.entries(tag.attrs).forEach(([key, value]) => {
          link.setAttribute(key, String(value));
        });

        this.document.head.appendChild(link);
      } else if (tag.type === 'script') {
        const script = this.document.createElement('script');
        script.className = this.metaTagClass;
        Object.entries(tag.attrs).forEach(([key, value]) => {
          script.setAttribute(key, String(value));
        });

        if (tag.content) {
          script.textContent = tag.content;
        }

        this.document.head.appendChild(script);
      }
    });

    if (headTags.some((tag) => tag.attrs.name === 'citation_title')) {
      const titleTag = headTags.find((tag) => tag.attrs.name === 'citation_title');

      if (titleTag?.attrs.content) {
        this.title.setTitle(`${String(this.defaultMetaTags.siteName)} | ${String(titleTag.attrs.content)}`);
      }
    }
  }

  private dispatchZoteroEvent(): void {
    const event = new Event('ZoteroItemUpdated', {
      bubbles: true,
      cancelable: true,
    });

    this.document.dispatchEvent(event);
  }
}
