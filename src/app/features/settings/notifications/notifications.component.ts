import { select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, effect, HostBinding, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { UserSettings } from '@osf/core/models';
import { GetCurrentUserSettings, UpdateUserSettings, UserSelectors } from '@osf/core/store/user';
import { SubHeaderComponent } from '@osf/shared/components';
import { SubscriptionEvent, SubscriptionFrequency } from '@shared/enums';

import { SUBSCRIPTION_EVENTS } from './constants';
import { EmailPreferencesForm, EmailPreferencesFormControls } from './models';
import {
  GetAllGlobalNotificationSubscriptions,
  NotificationSubscriptionSelectors,
  UpdateNotificationSubscription,
} from './store';

@Component({
  selector: 'osf-notifications',
  imports: [SubHeaderComponent, Checkbox, Button, TranslatePipe, ReactiveFormsModule, Skeleton, Select],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnInit {
  @HostBinding('class') classes = 'flex flex-1 flex-column';

  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  private currentUser = select(UserSelectors.getCurrentUser);
  private emailPreferences = select(UserSelectors.getCurrentUserSettings);
  private notificationSubscriptions = select(NotificationSubscriptionSelectors.getAllGlobalNotificationSubscriptions);

  protected isEmailPreferencesLoading = select(UserSelectors.isUserSettingsLoading);
  protected isSubmittingEmailPreferences = select(UserSelectors.isUserSettingsSubmitting);

  protected isNotificationSubscriptionsLoading = select(NotificationSubscriptionSelectors.isLoading);
  protected loadingEvents = signal<SubscriptionEvent[]>([]);

  protected EmailPreferencesFormControls = EmailPreferencesFormControls;
  protected emailPreferencesForm: EmailPreferencesForm = new FormGroup({
    [EmailPreferencesFormControls.SubscribeOsfGeneralEmail]: this.fb.control(false, { nonNullable: true }),
    [EmailPreferencesFormControls.SubscribeOsfHelpEmail]: this.fb.control(false, { nonNullable: true }),
  });

  protected readonly SUBSCRIPTION_EVENTS = SUBSCRIPTION_EVENTS;
  protected subscriptionFrequencyOptions = Object.entries(SubscriptionFrequency).map(([key, value]) => ({
    label: key,
    value,
  }));
  protected notificationSubscriptionsForm = this.fb.group(
    SUBSCRIPTION_EVENTS.reduce(
      (control, { event }) => {
        control[event] = this.fb.control<SubscriptionFrequency>(SubscriptionFrequency.Never, { nonNullable: true });
        return control;
      },
      {} as Record<string, FormControl<SubscriptionFrequency>>
    )
  );

  constructor() {
    effect(() => {
      if (this.emailPreferences()) {
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
      this.store.dispatch(new GetAllGlobalNotificationSubscriptions());
    }

    if (!this.emailPreferences()) {
      this.store.dispatch(new GetCurrentUserSettings());
    }
  }

  emailPreferencesFormSubmit(): void {
    if (!this.currentUser()) {
      return;
    }

    const formValue = this.emailPreferencesForm.value as UserSettings;
    this.store.dispatch(new UpdateUserSettings(this.currentUser()!.id, formValue));
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
      [EmailPreferencesFormControls.SubscribeOsfGeneralEmail]: this.emailPreferences()?.subscribeOsfGeneralEmail,
      [EmailPreferencesFormControls.SubscribeOsfHelpEmail]: this.emailPreferences()?.subscribeOsfHelpEmail,
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
