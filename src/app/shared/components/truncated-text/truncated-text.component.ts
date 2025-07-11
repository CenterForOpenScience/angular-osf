import { TranslatePipe } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, input, signal, viewChild } from '@angular/core';

@Component({
  selector: 'osf-truncated-text',
  templateUrl: './truncated-text.component.html',
  styleUrls: ['./truncated-text.component.scss'],
  imports: [CommonModule, TranslatePipe],
})
export class TruncatedTextComponent implements AfterViewInit {
  readonly text = input('');
  readonly hasContent = input<boolean>(false);
  readonly maxVisibleLines = input(3);
  protected readonly contentElement = viewChild<ElementRef>('textContent');
  protected isTextExpanded = signal(false);
  protected hasOverflowingText = signal(false);

  ngAfterViewInit() {
    this.checkTextOverflow();
  }

  checkTextOverflow(): void {
    const element = this.contentElement()?.nativeElement;
    if (!element) return;

    const hasOverflow = element.scrollHeight > element.clientHeight;
    this.hasOverflowingText.set(hasOverflow);
  }

  protected toggleTextExpansion(): void {
    this.isTextExpanded.update((expanded) => !expanded);
  }
}
