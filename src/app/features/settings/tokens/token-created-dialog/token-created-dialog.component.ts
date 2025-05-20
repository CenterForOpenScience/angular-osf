import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';

import { ClipboardModule } from '@angular/cdk/clipboard';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'osf-token-created-dialog',
  imports: [Button, InputText, IconField, InputIcon, ClipboardModule, TranslatePipe],
  templateUrl: './token-created-dialog.component.html',
  styleUrl: './token-created-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenCreatedDialogComponent {
  protected readonly dialogRef = inject(DynamicDialogRef);
  protected readonly config = inject(DynamicDialogConfig);

  readonly tokenInput = viewChild<ElementRef<HTMLInputElement>>('tokenInput');
  readonly tokenName = input(this.config.data?.tokenName ?? '');
  readonly tokenId = input(this.config.data?.tokenValue ?? '');
  protected readonly tokenCopiedNotificationVisible = signal(false);

  constructor() {
    afterNextRender(() => {
      const input = this.tokenInput();
      if (input) {
        input.nativeElement.setSelectionRange(0, 0);
      }
    });
  }

  protected tokenCopiedToClipboard(): void {
    this.tokenCopiedNotificationVisible.set(true);
    setTimeout(() => this.tokenCopiedNotificationVisible.set(false), 2000);
  }
}
