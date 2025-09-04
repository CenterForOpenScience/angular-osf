import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, effect, HostBinding, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { GetCurrentUserSettings, UpdateUserSettings, UserSelectors } from '@core/store/user';
import { InfoIconComponent, SubHeaderComponent } from '@osf/shared/components';
import { SubscriptionEvent, SubscriptionFrequency } from '@osf/shared/enums';
import { UserSettings } from '@osf/shared/models';
import { LoaderService, ToastService } from '@osf/shared/services';

import { SUBSCRIPTION_EVENTS } from './constants';
import { EmailPreferencesForm, EmailPreferencesFormControls } from './models';
import {
  GetAllGlobalNotificationSubscriptions,
  NotificationSubscriptionSelectors,
  UpdateNotificationSubscription,
} from './store';

@Component({
  selector: 'osf-notifications',
  imports: [
    Checkbox,
    Button,
    TranslatePipe,
    ReactiveFormsModule,
    Skeleton,
    Select,
    InfoIconComponent,
    SubHeaderComponent,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnInit {
  @HostBinding('class') classes = 'flex flex-1 flex-column';

  private readonly actions = createDispatchMap({
    getCurrentUserSettings: GetCurrentUserSettings,
    getAllGlobalNotificationSubscriptions: GetAllGlobalNotificationSubscriptions,
    updateUserSettings: UpdateUserSettings,
    updateNotificationSubscription: UpdateNotificationSubscription,
  });
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly loaderService = inject(LoaderService);

  private currentUser = select(UserSelectors.getCurrentUser);
  private emailPreferences = select(UserSelectors.getCurrentUserSettings);
  private notificationSubscriptions = select(NotificationSubscriptionSelectors.getAllGlobalNotificationSubscriptions);

  isEmailPreferencesLoading = select(UserSelectors.isUserSettingsLoading);
  isSubmittingEmailPreferences = select(UserSelectors.isUserSettingsSubmitting);

  isNotificationSubscriptionsLoading = select(NotificationSubscriptionSelectors.isLoading);

  EmailPreferencesFormControls = EmailPreferencesFormControls;
  emailPreferencesForm: EmailPreferencesForm = new FormGroup({
    [EmailPreferencesFormControls.SubscribeOsfGeneralEmail]: this.fb.control(false, { nonNullable: true }),
    [EmailPreferencesFormControls.SubscribeOsfHelpEmail]: this.fb.control(false, { nonNullable: true }),
  });

  readonly SUBSCRIPTION_EVENTS = SUBSCRIPTION_EVENTS;
  subscriptionFrequencyOptions = Object.entries(SubscriptionFrequency).map(([key, value]) => ({
    label: key,
    value,
  }));

  notificationSubscriptionsForm = this.fb.group(
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
      this.actions.getAllGlobalNotificationSubscriptions();
    }

    if (!this.emailPreferences()) {
      this.actions.getCurrentUserSettings();
    }
  }

  emailPreferencesFormSubmit(): void {
    if (!this.currentUser()) {
      return;
    }

    const formValue = this.emailPreferencesForm.value as UserSettings;

    this.loaderService.show();
    this.actions.updateUserSettings(this.currentUser()!.id, formValue).subscribe(() => {
      this.loaderService.hide();
      this.toastService.showSuccess('settings.notifications.emailPreferences.successUpdate');
    });
  }

  onSubscriptionChange(event: SubscriptionEvent, frequency: SubscriptionFrequency) {
    const user = this.currentUser();
    if (!user) return;
    const id = `${user.id}_${event}`;

    this.loaderService.show();
    this.actions.updateNotificationSubscription({ id, frequency }).subscribe(() => {
      this.loaderService.hide();
      this.toastService.showSuccess('settings.notifications.notificationPreferences.successUpdate');
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
