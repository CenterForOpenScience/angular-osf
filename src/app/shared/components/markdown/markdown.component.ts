import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  Signal,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import markdownItAtrules from '@centerforopenscience/markdown-it-atrules';
import { legacyImgSize } from '@mdit/plugin-img-size';
import markdownItKatex from '@traptitech/markdown-it-katex';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import markdownItVideo from 'markdown-it-video';

@Component({
  selector: 'osf-markdown',
  imports: [],
  templateUrl: './markdown.component.html',
  styleUrl: './markdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownComponent implements AfterViewInit {
  markdownText = input<string>('');

  @ViewChild('container', { static: false }) containerRef?: ElementRef<HTMLElement>;

  private md: MarkdownIt;
  private sanitizer = inject(DomSanitizer);
  private readonly environment = inject(ENVIRONMENT);
  private destroyRef = inject(DestroyRef);
  private clickHandler?: (event: MouseEvent) => void;

  renderedHtml: Signal<SafeHtml> = computed(() => {
    const result = this.md.render(this.markdownText());
    return this.sanitizer.bypassSecurityTrustHtml(result);
  });

  constructor() {
    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      breaks: true,
    })
      .use(markdownItAtrules, {
        type: 'osf',
        pattern:
          /^http(?:s?):\/\/(?:www\.)?[a-zA-Z0-9 .:]{1,}\/render\?url=http(?:s?):\/\/[a-zA-Z0-9 .:]{1,}\/([a-zA-Z0-9]{5})\/\?action=download|(^[a-zA-Z0-9]{5}$)/,
        format: (assetID: string) => {
          const id = '__markdown-it-atrules-' + Date.now();
          const downloadUrl = `${this.environment.webUrl}/download/${assetID}/?direct&mode=render`;
          const hostname = new URL(this.environment.webUrl).hostname;
          const mfrUrl = `https://mfr.us.${hostname}/render?url=${encodeURIComponent(downloadUrl)}`;
          return `<div id="${id}" class="mfr mfr-file"><iframe frameborder="0" allowfullscreen="" height="100%" width="100%" src="${mfrUrl}"></iframe></div>`;
        },
      })
      .use(markdownItKatex, {
        output: 'mathml',
        throwOnError: false,
      })
      .use(markdownItVideo, {
        youtube: { width: 560, height: 315 },
        vimeo: { width: 560, height: 315 },
      })
      .use(markdownItAnchor)
      .use(markdownItTocDoneRight, {
        placeholder: '@\\[toc\\]',
        listType: 'ul',
      })
      .use(legacyImgSize);
  }

  ngAfterViewInit(): void {
    this.setupClickHandler();
  }

  private setupClickHandler(): void {
    if (!this.containerRef?.nativeElement) {
      return;
    }

    const container = this.containerRef.nativeElement;

    this.clickHandler = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest('a');
      if (!anchor?.hash) {
        return;
      }

      const targetElement = document.getElementById(anchor.hash.substring(1));
      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    container.addEventListener('click', this.clickHandler);

    this.destroyRef.onDestroy(() => {
      container.removeEventListener('click', this.clickHandler!);
    });
  }
}
