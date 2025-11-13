import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';

import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';

import { CopyButtonComponent } from '@osf/shared/components/copy-button/copy-button.component';

@Component({
  selector: 'osf-token-created-dialog',
  imports: [Button, InputText, IconField, InputIcon, TranslatePipe, CopyButtonComponent],
  templateUrl: './token-created-dialog.component.html',
  styleUrl: './token-created-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenCreatedDialogComponent {
  readonly dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);

  readonly tokenInput = viewChild<ElementRef<HTMLInputElement>>('tokenInput');
  readonly tokenName = input(this.config.data?.tokenName ?? '');
  readonly tokenId = input(this.config.data?.tokenValue ?? '');

  constructor() {
    afterNextRender(() => {
      const input = this.tokenInput();
      if (input) {
        input.nativeElement.setSelectionRange(0, 0);
      }
    });
  }
}
