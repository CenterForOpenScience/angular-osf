import { Actions, createDispatchMap, ofActionSuccessful, select } from '@ngxs/store';

import { filter, take } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { GetCurrentUser } from '@core/store/user';
import { GetEmails, UserEmailsSelectors } from '@core/store/user-emails';
import { ConfirmEmailComponent } from '@shared/components';
import { CustomDialogService } from '@shared/services';

import { FullScreenLoaderComponent, ToastComponent } from './shared/components';

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
  private readonly actions$ = inject(Actions);
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

    this.actions$
      .pipe(
        ofActionSuccessful(GetCurrentUser),
        take(1)
      )
      .subscribe(() => {
        this.actions.getEmails();
      });

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
    const unverifiedEmailsData = this.unverifiedEmails();
    this.customDialogService.open(ConfirmEmailComponent, {
      header: unverifiedEmailsData[0].isMerge ? 'home.confirmEmail.merge.title' : 'home.confirmEmail.add.title',
      width: '448px',
      data: unverifiedEmailsData,
    });
  }
}
