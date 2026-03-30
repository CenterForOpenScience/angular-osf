import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { PrerenderReadyService } from '@core/services/prerender-ready.service';
import { replaceBadEncodedChars } from '@osf/shared/helpers/format-bad-encoding.helper';

import { MetadataRecordFormat } from '../enums/metadata-record-format.enum';
import { HeadTagDef } from '../models/meta-tags/head-tag-def.model';
import { MetaTagAuthor } from '../models/meta-tags/meta-tag-author.model';
import { Content, DataContent, MetaTagsData } from '../models/meta-tags/meta-tags-data.model';

import { MetadataRecordsService } from './metadata-records.service';

@Injectable({
  providedIn: 'root',
})
export class MetaTagsService {
  private readonly metadataRecords = inject(MetadataRecordsService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly prerenderReady = inject(PrerenderReadyService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

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

  constructor() {
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
    if (!isPlatformBrowser(this.platformId) || this.removeDynamicMetaTags() === 0) {
      this.areMetaTagsApplied.set(false);
      this.prerenderReady.setNotReady();
      return;
    }

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

  private applyMetaTagsData(metaTagsData: MetaTagsData): void {
    this.areMetaTagsApplied.set(false);
    this.prerenderReady.setNotReady();
    this.removeDynamicMetaTags();

    const combinedData = { ...this.defaultMetaTags, ...metaTagsData };
    const headTags = this.getHeadTags(combinedData);

    of(metaTagsData.osfGuid)
      .pipe(
        switchMap((osfid) =>
          osfid
            ? this.getSchemaDotOrgJsonLdHeadTag(osfid).pipe(
                tap((jsonLdHeadTag) => jsonLdHeadTag && headTags.push(jsonLdHeadTag)),
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

  private removeDynamicMetaTags(): number {
    const elements = this.document.querySelectorAll(`.${this.metaTagClass}`);
    elements.forEach((el) => el.parentNode?.removeChild(el));
    return elements.length;
  }

  private getSchemaDotOrgJsonLdHeadTag(osfid: string): Observable<HeadTagDef | null> {
    return this.metadataRecords
      .getMetadataRecord(osfid, MetadataRecordFormat.SchemaDotOrgDataset)
      .pipe(
        map((jsonLd) =>
          jsonLd ? { type: 'script' as const, attrs: { type: 'application/ld+json' }, content: jsonLd } : null
        )
      );
  }

  private getHeadTags(metaTagsData: MetaTagsData): HeadTagDef[] {
    const identifiers = [metaTagsData.url, metaTagsData.doi, metaTagsData.identifier].flatMap((v) => this.toArray(v));

    const metaTagsDefs: Record<string, DataContent | number | undefined> = {
      // Citation
      citation_title: metaTagsData.title,
      citation_doi: metaTagsData.doi,
      citation_publisher: metaTagsData.siteName,
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

      // Open Graph / Facebook
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

    const tags: HeadTagDef[] = Object.entries(metaTagsDefs)
      .flatMap(([name, content]) => {
        if (!content) return [];

        return this.toArray(content as DataContent)
          .filter(Boolean)
          .map((item) => ({
            type: 'meta' as const,
            attrs: this.makeMetaTagAttrs(name, this.buildMetaTagContent(name, item)),
          }));
      })
      .filter((tag) => tag.attrs.content);

    const canonicalUrl = this.toArray(metaTagsData.canonicalUrl || metaTagsData.url).find(Boolean);

    if (canonicalUrl) {
      tags.push({
        type: 'link',
        attrs: { rel: 'canonical', href: String(canonicalUrl), class: this.metaTagClass } as MetaDefinition,
      });
    }

    return tags;
  }

  private buildMetaTagContent(name: string, content: Content): Content {
    if (['citation_author', 'dc.creator'].includes(name) && typeof content === 'object') {
      const { familyName, givenName } = content as MetaTagAuthor;
      return `${familyName}, ${givenName}`;
    }
    return content;
  }

  private makeMetaTagAttrs(name: string, content: Content): MetaDefinition {
    const isProperty = name.startsWith('og:') || name.startsWith('fb:');
    return isProperty
      ? { property: name, content: String(content), class: this.metaTagClass }
      : ({ name, content: String(content), class: this.metaTagClass } as MetaDefinition);
  }

  private toArray(content: DataContent): Content[] {
    return Array.isArray(content) ? content : [content];
  }

  private applyHeadTags(headTags: HeadTagDef[]): void {
    headTags.forEach((tag) => {
      if (tag.type === 'meta') {
        this.meta.addTag(tag.attrs);
        return;
      }

      const el = this.document.createElement(tag.type);
      el.className = this.metaTagClass;
      Object.entries(tag.attrs).forEach(([key, value]) => el.setAttribute(key, String(value)));

      if (tag.type === 'script' && tag.content) {
        el.textContent = tag.content;
      }

      this.document.head.appendChild(el);
    });

    const citationTitle = headTags.find((tag) => tag.attrs.name === 'citation_title')?.attrs.content;
    if (citationTitle) {
      this.title.setTitle(
        replaceBadEncodedChars(`${String(this.defaultMetaTags.siteName)} | ${String(citationTitle)}`)
      );
    }
  }

  private dispatchZoteroEvent(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.document.dispatchEvent(new Event('ZoteroItemUpdated', { bubbles: true, cancelable: true }));
  }
}
