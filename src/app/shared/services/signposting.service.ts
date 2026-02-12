import { DOCUMENT } from '@angular/common';
import { inject, Injectable, RendererFactory2, RESPONSE_INIT } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { LINKSET_JSON_TYPE, LINKSET_TYPE, SignpostingLink } from '../models/signposting.model';

@Injectable({
  providedIn: 'root',
})
export class SignpostingService {
  private readonly document = inject(DOCUMENT);
  private readonly environment = inject(ENVIRONMENT);
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });
  private readonly renderer = inject(RendererFactory2).createRenderer(null, null);

  addSignposting(guid: string): void {
    const links = this.generateSignpostingLinks(guid);

    this.addSignpostingLinkHeaders(links);
    this.addSignpostingLinkTags(links);
  }

  addMetadataSignposting(guid: string): void {
    const links = this.generateSignpostingLinks(guid, true);

    this.addSignpostingLinkHeaders(links);
    this.addSignpostingLinkTags(links);
  }

  removeSignpostingLinkTags(): void {
    const linkElements = this.document.head.querySelectorAll('link[rel="linkset"], link[rel="describes"]');
    linkElements.forEach((linkElement) => {
      this.renderer.removeChild(this.document.head, linkElement);
    });
  }

  private generateSignpostingLinks(guid: string, isMetadata?: boolean): SignpostingLink[] {
    if (isMetadata) {
      return [
        {
          rel: 'describes',
          href: `${this.environment.webUrl}/${guid}/`,
          type: 'text/html',
        },
      ];
    }
    const baseUrl = `${this.environment.webUrl}/metadata/${guid}/`;

    return [
      {
        rel: 'linkset',
        href: this.buildUrl(baseUrl, 'linkset'),
        type: LINKSET_TYPE,
      },
      {
        rel: 'linkset',
        href: this.buildUrl(baseUrl, 'linkset+json'),
        type: LINKSET_JSON_TYPE,
      },
    ];
  }

  private buildUrl(base: string, format: string): string {
    const url = new URL(base);
    url.searchParams.set('format', format);
    return url.toString();
  }

  private addSignpostingLinkHeaders(links: SignpostingLink[]): void {
    if (!this.responseInit) return;

    const headers =
      this.responseInit.headers instanceof Headers ? this.responseInit.headers : new Headers(this.responseInit.headers);

    const linkHeaderValue = links.map((link) => `<${link.href}>; rel="${link.rel}"; type="${link.type}"`).join(', ');

    headers.set('Link', linkHeaderValue);
    this.responseInit.headers = headers;
  }

  private addSignpostingLinkTags(links: SignpostingLink[]): void {
    links.forEach((link) => {
      const linkElement = this.renderer.createElement('link');
      this.renderer.setAttribute(linkElement, 'rel', link.rel);
      this.renderer.setAttribute(linkElement, 'href', link.href);
      this.renderer.setAttribute(linkElement, 'type', link.type);
      this.renderer.appendChild(this.document.head, linkElement);
    });
  }
}
