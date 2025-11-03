import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';

import { DOCUMENT } from '@angular/common';
import { DestroyRef, effect, Inject, inject, Injectable, signal } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { PrerenderReadyService } from '@core/services/prerender-ready.service';

import { MetadataRecordFormat } from '../enums/metadata-record-format.enum';
import { HeadTagDef } from '../models/meta-tags/head-tag-def.model';
import { MetaTagAuthor } from '../models/meta-tags/meta-tag-author.model';
import { Content, DataContent, MetaTagsData } from '../models/meta-tags/meta-tags-data.model';

import { MetadataRecordsService } from './metadata-records.service';

@Injectable({
  providedIn: 'root',
})
export class MetaTagsService {
  private readonly metadataRecords: MetadataRecordsService = inject(MetadataRecordsService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly prerenderReady = inject(PrerenderReadyService);

  get webUrl() {
    return this.environment.webUrl;
  }

  get facebookAppId() {
    return this.environment.facebookAppId;
  }

  get twitterHandle() {
    return this.environment.twitterHandle;
  }

  private readonly defaultMetaTags: MetaTagsData = {
    type: 'article',
    description: 'Hosted on the OSF',
    language: 'en-US',
    image: `${this.webUrl}/assets/images/osf-sharing.png`,
    imageType: 'image/png',
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: 'OSF',
    siteName: 'OSF',
    institution: 'Center for Open Science',
    fbAppId: this.facebookAppId,
    twitterSite: this.twitterHandle,
    twitterCreator: this.twitterHandle,
  };

  private readonly metaTagClass = 'osf-dynamic-meta';

  private metaTagStack: { metaTagsData: MetaTagsData; componentDestroyRef: DestroyRef }[] = [];

  areMetaTagsApplied = signal(false);

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document
  ) {
    effect(() => {
      if (this.areMetaTagsApplied()) {
        this.prerenderReady.setReady();
      }
    });
  }

  updateMetaTags(metaTagsData: MetaTagsData, componentDestroyRef: DestroyRef): void {
    this.metaTagStack = [...this.metaTagStackWithout(componentDestroyRef), { metaTagsData, componentDestroyRef }];
    componentDestroyRef.onDestroy(() => {
      this.metaTagStack = this.metaTagStackWithout(componentDestroyRef);
      this.applyNearestMetaTags();
    });
    this.applyNearestMetaTags();
  }

  clearMetaTags(): void {
    const elementsToRemove = this.document.querySelectorAll(`.${this.metaTagClass}`);

    if (elementsToRemove.length === 0) {
      this.areMetaTagsApplied.set(false);
      this.prerenderReady.setNotReady();
      return;
    }

    elementsToRemove.forEach((element) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });

    this.title.setTitle(String(this.defaultMetaTags.siteName));
    this.areMetaTagsApplied.set(false);
    this.prerenderReady.setNotReady();
  }

  private metaTagStackWithout(destroyRefToRemove: DestroyRef) {
    return this.metaTagStack.filter(({ componentDestroyRef }) => componentDestroyRef !== destroyRefToRemove);
  }

  private applyNearestMetaTags() {
    const nearest = this.metaTagStack.at(-1);
    if (nearest) {
      this.applyMetaTagsData(nearest.metaTagsData);
    } else {
      this.clearMetaTags();
    }
  }

  private applyMetaTagsData(metaTagsData: MetaTagsData) {
    this.areMetaTagsApplied.set(false);
    this.prerenderReady.setNotReady();
    const combinedData = { ...this.defaultMetaTags, ...metaTagsData };
    const headTags = this.getHeadTags(combinedData);
    of(metaTagsData.osfGuid)
      .pipe(
        switchMap((osfid) =>
          osfid
            ? this.getSchemaDotOrgJsonLdHeadTag(osfid).pipe(
                tap((jsonLdHeadTag) => {
                  if (jsonLdHeadTag) {
                    headTags.push(jsonLdHeadTag);
                  }
                }),
                catchError(() => of(null))
              )
            : of(null)
        ),
        tap(() => {
          this.applyHeadTags(headTags);
          this.areMetaTagsApplied.set(true);
          this.dispatchZoteroEvent();
        })
      )
      .subscribe();
  }

  private getSchemaDotOrgJsonLdHeadTag(osfid: string): Observable<HeadTagDef | null> {
    return this.metadataRecords.getMetadataRecord(osfid, MetadataRecordFormat.SchemaDotOrgDataset).pipe(
      map((jsonLd) =>
        jsonLd
          ? {
              type: 'script' as const,
              attrs: { type: 'application/ld+json' },
              content: jsonLd,
            }
          : null
      )
    );
  }

  private getHeadTags(metaTagsData: MetaTagsData): HeadTagDef[] {
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
      'dc.creator': metaTagsData.contributors,
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

    return Object.entries(metaTagsDefs)
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
  }

  private buildMetaTagContent(name: string, content: Content): Content {
    if (['citation_author', 'dc.creator'].includes(name) && typeof content === 'object') {
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
