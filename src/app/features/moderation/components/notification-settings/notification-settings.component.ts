import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { SubscriptionEvent } from '@osf/shared/enums/subscriptions/subscription-event.enum';
import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';
import { NotificationSubscription } from '@osf/shared/models/notifications/notification-subscription.model';
import { ToastService } from '@osf/shared/services/toast.service';

import {
  GetProviderSubscriptions,
  ProviderSubscriptionsSelectors,
  UpdateProviderSubscription,
} from '../../store/provider-subscriptions';

const PROVIDER_TYPE_MAP: Partial<Record<ResourceType, string>> = {
  [ResourceType.Preprint]: 'preprints',
  [ResourceType.Collection]: 'collections',
  [ResourceType.Registration]: 'registrations',
};

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
  readonly resourceType: Signal<ResourceType | undefined> = toSignal(
    this.route.data.pipe(map((params) => params['resourceType'])) ?? of(undefined)
  );
  readonly providerType = computed(() => {
    const rt = this.resourceType();
    return rt !== undefined ? PROVIDER_TYPE_MAP[rt] : undefined;
  });

  subscriptions = select(ProviderSubscriptionsSelectors.getSubscriptions);
  isLoading = select(ProviderSubscriptionsSelectors.isLoading);

  form = this.fb.group({} as Record<string, FormControl<SubscriptionFrequency>>);

  frequencyOptions = Object.entries(SubscriptionFrequency).map(([key, value]) => ({
    label: key,
    value,
  }));

  private readonly actions = createDispatchMap({
    getProviderSubscriptions: GetProviderSubscriptions,
    updateProviderSubscription: UpdateProviderSubscription,
  });

  constructor() {
    effect(() => {
      const subs = this.subscriptions();
      Object.keys(this.form.controls).forEach((k) => this.form.removeControl(k, { emitEvent: false }));
      subs.forEach((sub) => {
        this.form.addControl(sub.id, this.fb.control(sub.frequency, { nonNullable: true }), { emitEvent: false });
      });
    });
  }

  ngOnInit(): void {
    const providerType = this.providerType();
    const providerId = this.providerId();
    if (providerType && providerId) {
      this.actions.getProviderSubscriptions(providerType, providerId);
    }
  }

  labelKey(event: SubscriptionEvent): string {
    return `moderation.notificationPreferences.items.${event}`;
  }

  onFrequencyChange(sub: NotificationSubscription, frequency: SubscriptionFrequency): void {
    const providerType = this.providerType();
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
      .subscribe(() => {
        this.toastService.showSuccess('moderation.notificationPreferences.successUpdate');
      });
  }
}
