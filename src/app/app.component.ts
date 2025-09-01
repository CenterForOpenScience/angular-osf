import { createDispatchMap, select } from '@ngxs/store';

import { TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';

import { filter } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { GetCurrentUser } from '@core/store/user';
import { GetEmails, UserEmailsSelectors } from '@core/store/user-emails';
import { ConfirmEmailComponent } from '@shared/components';

import { FullScreenLoaderComponent, ToastComponent } from './shared/components';
import { MetaTagsService } from './shared/services/meta-tags.service';

@Component({
  selector: 'osf-root',
  imports: [RouterOutlet, ToastComponent, FullScreenLoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class AppComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  private readonly metaTagsService = inject(MetaTagsService);

  private readonly actions = createDispatchMap({ getCurrentUser: GetCurrentUser, getEmails: GetEmails });

  unverifiedEmails = select(UserEmailsSelectors.getUnverifiedEmails);

  constructor() {
    this.setupMetaTagsCleanup();
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

  private setupMetaTagsCleanup(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event: NavigationEnd) => this.metaTagsService.clearMetaTagsIfNeeded(event.url));
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
