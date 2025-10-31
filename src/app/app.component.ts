import { Actions, createDispatchMap, ofActionSuccessful, select } from '@ngxs/store';

import { filter, take } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { GetCurrentUser } from '@core/store/user';
import { GetEmails, UserEmailsSelectors } from '@core/store/user-emails';

import { ConfirmEmailComponent } from './shared/components/confirm-email/confirm-email.component';
import { FullScreenLoaderComponent } from './shared/components/full-screen-loader/full-screen-loader.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { CustomDialogService } from './shared/services/custom-dialog.service';

import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { AnalyticsService } from '@osf/shared/services/analytics.service';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';

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
  private readonly analyticsService = inject(AnalyticsService);
  private readonly actions = createDispatchMap({ getCurrentUser: GetCurrentUser, getEmails: GetEmails });

  unverifiedEmails = select(UserEmailsSelectors.getUnverifiedEmails);
  currentResource = select(CurrentResourceSelectors.getCurrentResource);
  isProjectOrRegistration = computed(
    () =>
      this.currentResource()?.type === CurrentResourceType.Projects ||
      this.currentResource()?.type === CurrentResourceType.Registrations
  );

  constructor() {
    effect(() => {
      if (this.unverifiedEmails().length) {
        this.showEmailDialog();
      }
    });
  }

  ngOnInit(): void {
    this.actions.getCurrentUser();

    this.actions$.pipe(ofActionSuccessful(GetCurrentUser), take(1)).subscribe(() => {
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

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event: NavigationEnd) => {
        this.sendCountedUsageForRegistrationAndProjects(event.urlAfterRedirects);
      });
  }

  sendCountedUsageForRegistrationAndProjects(urlPath: string) {
    const detailsPaths = [
      '/overview',
      '/metadata/osf',
      '/files',
      '/resources',
      '/wiki',
      '/components',
      '/contributors',
      '/links',
      '/analytics',
      '/recent-activity',
    ];
    // check if it is detail page tab is opened for Project or Registration to log into metrics
    if (this.isProjectOrRegistration() && detailsPaths.some((path) => urlPath.endsWith(path))) {
      const resource = this.currentResource();
      let route = urlPath.split('/').filter(Boolean).join('.');

      if (resource?.type) {
        route = `${resource?.type}.${route}`;
      }

      if (resource) {
        this.analyticsService.sendCountedUsage(resource, route).subscribe();
      }
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
