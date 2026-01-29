import { createDispatchMap, select } from '@ngxs/store';

import { switchMap, timer } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { GetCurrentUser } from '@core/store/user';
import { GetEmails, UserEmailsSelectors } from '@core/store/user-emails';

import { ConfirmEmailComponent } from './shared/components/confirm-email/confirm-email.component';
import { FullScreenLoaderComponent } from './shared/components/full-screen-loader/full-screen-loader.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { CustomDialogService } from './shared/services/custom-dialog.service';
import { LoaderService } from './shared/services/loader.service';

import { GoogleTagManagerService } from 'angular-google-tag-manager';

@Component({
  selector: 'osf-root',
  imports: [RouterOutlet, ToastComponent, FullScreenLoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly googleTagManagerService = inject(GoogleTagManagerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly router = inject(Router);
  private readonly environment = inject(ENVIRONMENT);
  private readonly actions = createDispatchMap({ getCurrentUser: GetCurrentUser, getEmails: GetEmails });
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly loaderService = inject(LoaderService);

  unverifiedEmails = select(UserEmailsSelectors.getUnverifiedEmails);

  constructor() {
    effect(() => {
      if (this.unverifiedEmails().length) {
        this.showEmailDialog();
      }
    });
  }

  ngOnInit(): void {
    this.actions
      .getCurrentUser()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.actions.getEmails())
      )
      .subscribe();

    if (this.isBrowser) {
      this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loaderService.show();
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          timer(500)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.loaderService.hide());
        }

        if (this.environment.googleTagManagerId && event instanceof NavigationEnd) {
          this.googleTagManagerService.pushTag({
            event: 'page',
            pageName: event.urlAfterRedirects,
          });
        }
      });
    }
  }

  private showEmailDialog() {
    const unverifiedEmailsData = this.unverifiedEmails();
    this.customDialogService.open(ConfirmEmailComponent, {
      header: unverifiedEmailsData[0].isMerge ? 'home.confirmEmail.merge.title' : 'home.confirmEmail.add.title',
      width: '448px',
      data: unverifiedEmailsData,
    });
  }
}
