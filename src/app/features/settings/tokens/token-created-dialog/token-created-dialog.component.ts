import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  viewChild,
  afterNextRender,
  ElementRef,
} from '@angular/core';
import { Button } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'osf-token-created-dialog',
  standalone: true,
  imports: [
    Button,
    InputText,
    IconField,
    InputIcon,
    ClipboardModule,
    TranslatePipe,
  ],
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
