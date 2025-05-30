import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';

import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  model,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RedirectUrlDataModel } from '@osf/features/project/settings/models';

@Component({
  selector: 'osf-settings-redirect-link',
  imports: [Card, Checkbox, TranslatePipe, FormsModule, InputText, TitleCasePipe, UpperCasePipe, Button],
  templateUrl: './settings-redirect-link.component.html',
  styleUrl: '../../settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsRedirectLinkComponent {
  redirectUrlDataChange = output<RedirectUrlDataModel>();
  redirectUrlDataInput = input.required<RedirectUrlDataModel>();
  redirectLink = model<boolean>();

  redirectUrlData: WritableSignal<RedirectUrlDataModel> = signal({ url: '', label: '' });

  constructor() {
    effect(() => {
      this.redirectUrlData.set(this.redirectUrlDataInput());
      const { url, label } = this.redirectUrlDataInput();
      if (url || label) {
        this.redirectLink.set(true);
      }
    });
  }

  onToggleRedirectLink(checked: boolean): void {
    this.redirectLink.set(checked);
    if (!checked) {
      this.redirectUrlData.set({ url: '', label: '' });
      this.redirectUrlDataChange.emit(this.redirectUrlData());
    }
  }

  emitIfChecked(): void {
    if (this.redirectLink()) {
      this.redirectUrlDataChange.emit(this.redirectUrlData());
    }
  }
}
