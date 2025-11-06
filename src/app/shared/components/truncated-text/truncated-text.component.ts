import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { timer } from 'rxjs';

import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'osf-truncated-text',
  imports: [TranslatePipe, Button],
  templateUrl: './truncated-text.component.html',
  styleUrls: ['./truncated-text.component.scss'],
})
export class TruncatedTextComponent implements AfterViewInit {
  readonly text = input('');
  readonly maxVisibleLines = input(3);
  readonly navigateOnReadMore = input(false);
  readonly link = input<string[]>([]);
  readonly hasOwnContent = input(false);
  readonly readMoreLabel = input('truncatedText.readMore');
  readonly hideLabel = input('truncatedText.hide');
  readonly contentElement = viewChild<ElementRef>('textContent');

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  isTextExpanded = signal(false);
  hasOverflowingText = signal(false);

  buttonLabel = () => {
    if (this.navigateOnReadMore()) {
      return this.readMoreLabel();
    }

    return this.isTextExpanded() ? this.hideLabel() : this.readMoreLabel();
  };

  constructor() {
    effect(() => {
      const currentText = this.text();
      if (currentText) {
        this.isTextExpanded.set(false);
        timer(0)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => this.checkTextOverflow());
      }
    });
  }

  ngAfterViewInit() {
    this.checkTextOverflow();
  }

  checkTextOverflow(): void {
    const element = this.contentElement()?.nativeElement;
    if (!element) return;

    const hasOverflow = element.scrollHeight > element.clientHeight;
    this.hasOverflowingText.set(hasOverflow);
  }

  handleButtonClick(): void {
    if (this.navigateOnReadMore()) {
      this.router.navigate(this.link());
    } else {
      this.isTextExpanded.update((expanded) => !expanded);
    }
  }
}
