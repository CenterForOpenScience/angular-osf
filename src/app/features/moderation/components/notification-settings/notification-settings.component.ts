import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SUBSCRIPTION_FREQUENCY_OPTIONS } from '@osf/shared/constants/subscription-options.const';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';
import { NotificationSubscription } from '@osf/shared/models/notifications/notification-subscription.model';
import { ToastService } from '@osf/shared/services/toast.service';

import {
  GetProviderSubscriptions,
  ProviderSubscriptionsSelectors,
  UpdateProviderSubscription,
} from '../../store/provider-subscriptions';

@Component({
  selector: 'osf-notification-settings',
  imports: [TranslatePipe, RouterLink, ReactiveFormsModule, Select, Skeleton],
  templateUrl: './notification-settings.component.html',
  styleUrl: './notification-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSettingsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly providerId = toSignal(
    this.route.parent?.params.pipe(map((params) => params['providerId'])) ?? of(undefined)
  );
  readonly resourceType: Signal<CurrentResourceType | undefined> = toSignal(
    this.route.data.pipe(map((params) => params['resourceType']))
  );

  subscriptions = select(ProviderSubscriptionsSelectors.getSubscriptions);
  isLoading = select(ProviderSubscriptionsSelectors.isLoading);

  readonly form = new FormRecord<FormControl<SubscriptionFrequency>>({});

  readonly frequencyOptions = SUBSCRIPTION_FREQUENCY_OPTIONS;

  private readonly actions = createDispatchMap({
    getProviderSubscriptions: GetProviderSubscriptions,
    updateProviderSubscription: UpdateProviderSubscription,
  });

  constructor() {
    effect(() => {
      const subs = this.subscriptions();
      subs.forEach((sub) => {
        const control = this.form.controls[sub.id];
        if (!control) {
          this.form.addControl(sub.id, this.fb.control(sub.frequency, { nonNullable: true }), { emitEvent: false });
          return;
        }

        if (control.value !== sub.frequency) {
          control.setValue(sub.frequency, { emitEvent: false });
        }
      });
    });
  }

  ngOnInit(): void {
    const providerType = this.resourceType();
    const providerId = this.providerId();
    if (providerType && providerId) {
      this.actions.getProviderSubscriptions(providerType, providerId);
    }
  }

  onFrequencyChange(sub: NotificationSubscription, frequency: SubscriptionFrequency): void {
    if (sub.frequency === frequency) return;

    const providerType = this.resourceType();
    const providerId = this.providerId();
    if (!providerType || !providerId) return;

    this.actions
      .updateProviderSubscription({
        providerType,
        providerId,
        subscriptionId: sub.id,
        frequency,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.toastService.showSuccess('moderation.notificationPreferences.successUpdate'));
  }
}
