import { createDispatchMap, select } from '@ngxs/store';

import { TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';

import { filter } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { CookieConsentBannerComponent } from '@core/components/osf-banners/cookie-consent-banner/cookie-consent-banner.component';
import { ENVIRONMENT } from '@core/provider/environment.provider';
import { GetCurrentUser } from '@core/store/user';
import { GetEmails, UserEmailsSelectors } from '@core/store/user-emails';
import { ConfirmEmailComponent } from '@shared/components';

import { FullScreenLoaderComponent, ToastComponent } from './shared/components';

import { GoogleTagManagerService } from 'angular-google-tag-manager';

@Component({
  selector: 'osf-root',
  imports: [RouterOutlet, ToastComponent, FullScreenLoaderComponent, CookieConsentBannerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class AppComponent implements OnInit {
  private readonly googleTagManagerService = inject(GoogleTagManagerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  private readonly environment = inject(ENVIRONMENT);

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

    if (this.environment.googleTagManagerId) {
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((event: NavigationEnd) => {
          this.googleTagManagerService.pushTag({
            event: 'page',
            pageName: event.urlAfterRedirects,
          });
        });
    }
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
