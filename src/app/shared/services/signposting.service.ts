import { of } from 'rxjs';

import { inject, Injectable, RESPONSE_INIT } from '@angular/core';

import { SignpostingLink } from '../models/meta-tags/meta-tags-data.model';

@Injectable({
  providedIn: 'root',
})
export class SignpostingService {
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });

  mockSignpostingLinks: SignpostingLink[] = [
    {
      rel: 'describedby',
      href: '/api/descriptions/project-123',
      type: 'application/json',
    },
    {
      rel: 'cite-as',
      href: 'https://doi.org/10.1234/example',
      type: 'text/html',
    },
    {
      rel: 'item',
      href: '/project/123/files/',
      type: 'text/html',
      title: 'Project Files',
    },
    {
      rel: 'collection',
      href: '/user/projects/',
      type: 'text/html',
      title: 'User Projects',
    },
  ];

  addSignpostingHeaders(): void {
    of(this.mockSignpostingLinks).subscribe({
      next: (links) => {
        if (!this.responseInit || !this.responseInit.headers) {
          return;
        }

        const headers =
          this.responseInit?.headers instanceof Headers
            ? this.responseInit.headers
            : new Headers(this.responseInit?.headers);

        const linkHeader = this.formatLinkHeader(links);
        headers.set('Link', linkHeader);

        this.responseInit.headers = headers;
      },
    });
  }

  formatLinkHeader(links: SignpostingLink[]): string {
    return links
      .map((link) => {
        const parts = [`<${link.href}>`, `rel="${link.rel}"`];
        if (link.type) parts.push(`type="${link.type}"`);
        if (link.title) parts.push(`title="${link.title}"`);
        return parts.join('; ');
      })
      .join(', ');
  }
}
