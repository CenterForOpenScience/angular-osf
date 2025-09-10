import { createDispatchMap, select } from '@ngxs/store';

import { TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { GetCurrentUser } from '@core/store/user';
import { GetEmails, UserEmailsSelectors } from '@core/store/user-emails';
import { ConfirmEmailComponent } from '@shared/components';
import { CookieConsentComponent } from '@shared/components/cookie-consent/cookie-consent.component';

import { FullScreenLoaderComponent, ToastComponent } from './shared/components';

@Component({
  selector: 'osf-root',
  imports: [RouterOutlet, ToastComponent, FullScreenLoaderComponent, CookieConsentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class AppComponent implements OnInit {
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);

  private readonly actions = createDispatchMap({ getCurrentUser: GetCurrentUser, getEmails: GetEmails });

  unverifiedEmails = select(UserEmailsSelectors.getUnverifiedEmails);

  constructor() {
    effect(() => {
      if (this.unverifiedEmails().length) {
        this.showEmailDialog();
      }
    });
  }

  ngOnInit(): void {
    this.actions.getCurrentUser();
    this.actions.getEmails();
  }

  private showEmailDialog() {
    this.dialogService.open(ConfirmEmailComponent, {
      width: '448px',
      focusOnShow: false,
      header: this.translateService.instant('home.confirmEmail.title'),
      modal: true,
      closable: false,
      data: this.unverifiedEmails(),
    });
  }
}
