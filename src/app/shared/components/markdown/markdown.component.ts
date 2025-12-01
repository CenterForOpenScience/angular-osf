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
      .use(markdownItVideo, {
        youtube: { width: 560, height: 315 },
        vimeo: { width: 560, height: 315 },
      })
      .use(markdownItKatex, {
        output: 'mathml',
        throwOnError: false,
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
