import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Textarea } from 'primeng/textarea';

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'osf-send-email-dialog',
  imports: [FormsModule, Button, Checkbox, TranslatePipe, Textarea],
  templateUrl: './send-email-dialog.component.html',
  styleUrl: './send-email-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendEmailDialogComponent {
  private readonly dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);

  emailContent = signal<string>('');
  ccSender = signal<boolean>(false);
  allowReplyToSender = signal<boolean>(false);
  currentUserName = signal<string>('');

  onCancel(): void {
    this.dialogRef.close();
  }

  onSend(): void {
    if (this.emailContent().trim()) {
      const data = {
        emailContent: this.emailContent(),
        ccSender: this.ccSender(),
        allowReplyToSender: this.allowReplyToSender(),
      };
      this.dialogRef.close(data);
    }
  }
}
