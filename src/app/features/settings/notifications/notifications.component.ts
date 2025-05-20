import { select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, effect, HostBinding, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { UserSettings } from '@core/services/user/user.models';
import { GetCurrentUserSettings, UpdateUserSettings, UserSelectors } from '@core/store/user';
import { SubscriptionEvent, SubscriptionFrequency } from '@osf/features/settings/notifications/enums';
import { EmailPreferencesForm, EmailPreferencesFormControls } from '@osf/features/settings/notifications/models';
import {
  GetAllGlobalNotificationSubscriptions,
  NotificationSubscriptionSelectors,
  UpdateNotificationSubscription,
} from '@osf/features/settings/notifications/store';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';

@Component({
  selector: 'osf-notifications',
  standalone: true,
  imports: [SubHeaderComponent, Checkbox, Button, DropdownModule, TranslatePipe, ReactiveFormsModule, Skeleton],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnInit {
  @HostBinding('class') classes = 'flex flex-1 flex-column';

  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  private currentUser = select(UserSelectors.getCurrentUser);
  private userSettings = select(UserSelectors.getCurrentUserSettings);
  private notificationSubscriptions = select(NotificationSubscriptionSelectors.getAllGlobalNotificationSubscriptions);

  protected isEmailPreferencesLoading = signal(false);
  protected isNotificationSubscriptionsLoading = signal(false);
  protected isSubmittingEmailPreferences = signal(false);
  protected EmailPreferencesFormControls = EmailPreferencesFormControls;
  protected emailPreferencesForm: EmailPreferencesForm = new FormGroup({
    [EmailPreferencesFormControls.SubscribeOsfGeneralEmail]: this.fb.control(false, { nonNullable: true }),
    [EmailPreferencesFormControls.SubscribeOsfHelpEmail]: this.fb.control(false, { nonNullable: true }),
  });

  protected subscriptionFrequencyOptions = Object.entries(SubscriptionFrequency).map(([key, value]) => ({
    label: key,
    value,
  }));

  protected subscriptionItems: {
    event: SubscriptionEvent;
    labelKey: string;
  }[] = [
    {
      event: SubscriptionEvent.GlobalCommentReplies,
      labelKey: 'settings.notifications.notificationPreferences.items.replies',
    },
    {
      event: SubscriptionEvent.GlobalComments,
      labelKey: 'settings.notifications.notificationPreferences.items.comments',
    },
    {
      event: SubscriptionEvent.GlobalFileUpdated,
      labelKey: 'settings.notifications.notificationPreferences.items.files',
    },
    {
      event: SubscriptionEvent.GlobalMentions,
      labelKey: 'settings.notifications.notificationPreferences.items.mentions',
    },
    {
      event: SubscriptionEvent.GlobalReviews,
      labelKey: 'settings.notifications.notificationPreferences.items.preprints',
    },
  ];

  protected loadingEvents = signal<SubscriptionEvent[]>([]);

  protected notificationSubscriptionsForm = this.fb.group(
    this.subscriptionItems.reduce(
      (ctrls, { event }) => {
        ctrls[event] = this.fb.control<SubscriptionFrequency>(SubscriptionFrequency.Never, { nonNullable: true });
        return ctrls;
      },
      {} as Record<string, FormControl<SubscriptionFrequency>>
    )
  );

  constructor() {
    effect(() => {
      if (this.userSettings()) {
        this.updateEmailPreferencesForm();
      }
    });

    effect(() => {
      if (this.notificationSubscriptions()) {
        this.updateNotificationSubscriptionsForm();
      }
    });
  }

  ngOnInit(): void {
    if (!this.notificationSubscriptions().length) {
      this.isNotificationSubscriptionsLoading.set(true);
      this.store.dispatch(new GetAllGlobalNotificationSubscriptions()).subscribe({
        complete: () => this.isNotificationSubscriptionsLoading.set(false),
      });
    }

    if (!this.userSettings()) {
      this.isEmailPreferencesLoading.set(true);

      this.store.dispatch(new GetCurrentUserSettings()).subscribe({
        complete: () => this.isEmailPreferencesLoading.set(false),
      });
    }
  }

  emailPreferencesFormSubmit(): void {
    if (!this.currentUser()) {
      return;
    }

    const formValue = this.emailPreferencesForm.value as UserSettings;
    this.isSubmittingEmailPreferences.set(true);
    this.store.dispatch(new UpdateUserSettings(this.currentUser()!.id, formValue)).subscribe({
      complete: () => this.isSubmittingEmailPreferences.set(false),
    });
  }

  onSubscriptionChange(event: SubscriptionEvent, frequency: SubscriptionFrequency) {
    const user = this.currentUser();
    if (!user) return;
    const id = `${user.id}_${event}`;

    this.loadingEvents.update((list) => [...list, event]);

    this.store.dispatch(new UpdateNotificationSubscription({ id, frequency })).subscribe({
      complete: () => {
        this.loadingEvents.update((list) => list.filter((item) => item !== event));
      },
    });
  }

  private updateEmailPreferencesForm() {
    this.emailPreferencesForm.patchValue({
      [EmailPreferencesFormControls.SubscribeOsfGeneralEmail]: this.userSettings()?.subscribeOsfGeneralEmail,
      [EmailPreferencesFormControls.SubscribeOsfHelpEmail]: this.userSettings()?.subscribeOsfHelpEmail,
    });
  }

  private updateNotificationSubscriptionsForm() {
    const patch: Record<string, SubscriptionFrequency> = {};
    for (const sub of this.notificationSubscriptions()) {
      patch[sub.event] = sub.frequency;
    }
    this.notificationSubscriptionsForm.patchValue(patch);
  }
}
