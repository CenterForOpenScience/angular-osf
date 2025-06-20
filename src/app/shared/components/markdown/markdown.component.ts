import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import MarkdownIt from 'markdown-it';
import markdownItVideo from 'markdown-it-video';

@Component({
  selector: 'osf-markdown',
  imports: [],
  templateUrl: './markdown.component.html',
  styleUrl: './markdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownComponent {
  markdownText = input<string>('');

  private md: MarkdownIt;
  private sanitizer = inject(DomSanitizer);

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
    }).use(markdownItVideo, {
      youtube: { width: 560, height: 315 },
      vimeo: { width: 560, height: 315 },
    });
  }
}
