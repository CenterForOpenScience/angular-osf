import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { SubscriptionEvent } from '@osf/shared/enums/subscriptions/subscription-event.enum';
import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';
import { NotificationSubscription } from '@osf/shared/models/notifications/notification-subscription.model';
import { ToastService } from '@osf/shared/services/toast.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import {
  GetProviderSubscriptions,
  ProviderSubscriptionsSelectors,
  UpdateProviderSubscription,
} from '../../store/provider-subscriptions';

import { NotificationSettingsComponent } from './notification-settings.component';

interface SetupOverrides extends BaseSetupOverrides {
  resourceType?: CurrentResourceType;
  withResourceType?: boolean;
}

describe('NotificationSettingsComponent', () => {
  let fixture: ComponentFixture<NotificationSettingsComponent>;
  let component: NotificationSettingsComponent;
  let store: Store;
  let toastService: ToastServiceMockType;
  let subscriptionsSignal: WritableSignal<NotificationSubscription[]>;

  const providerId = 'provider-123';
  const defaultSubscriptions: NotificationSubscription[] = [
    {
      id: 'sub-1',
      event: SubscriptionEvent.ProviderNewPendingSubmissions,
      frequency: SubscriptionFrequency.Daily,
    },
    {
      id: 'sub-2',
      event: SubscriptionEvent.ProviderNewPendingWithdrawRequests,
      frequency: SubscriptionFrequency.Instant,
    },
  ];

  const setup = (overrides: SetupOverrides = {}) => {
    subscriptionsSignal = signal(defaultSubscriptions);
    const defaultSignals: SignalOverride[] = [
      { selector: ProviderSubscriptionsSelectors.getSubscriptions, value: subscriptionsSignal },
      { selector: ProviderSubscriptionsSelectors.isLoading, value: false },
    ];

    const mergedSignals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);
    const withResourceType = overrides.withResourceType ?? true;
    const routeBuilder = ActivatedRouteMockBuilder.create();
    if (withResourceType) {
      routeBuilder.withData({
        resourceType: overrides.resourceType ?? CurrentResourceType.Preprints,
      });
    }

    if (overrides.hasParent === false) {
      routeBuilder.withNoParent();
    } else {
      routeBuilder.withParams(overrides.routeParams ?? { providerId });
    }

    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [NotificationSettingsComponent],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, routeBuilder.build()),
        MockProvider(ToastService, toastService),
        provideMockStore({ signals: mergedSignals }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(NotificationSettingsComponent);
    component = fixture.componentInstance;
  };

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should dispatch GetProviderSubscriptions on init when provider data exists', () => {
    setup();

    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(
      new GetProviderSubscriptions(CurrentResourceType.Preprints, providerId)
    );
  });

  it('should not dispatch GetProviderSubscriptions on init when providerId is missing', () => {
    setup({ hasParent: false });

    component.ngOnInit();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should sync subscription values into form controls', async () => {
    setup();

    fixture.detectChanges();

    expect(component.form.controls['sub-1']?.value).toBe(SubscriptionFrequency.Daily);
    subscriptionsSignal.set([
      {
        ...defaultSubscriptions[0],
        frequency: SubscriptionFrequency.Never,
      },
      defaultSubscriptions[1],
    ]);

    await fixture.whenStable();

    expect(component.form.controls['sub-1']?.value).toBe(SubscriptionFrequency.Never);
  });

  it('should dispatch UpdateProviderSubscription and show success toast on frequency change', () => {
    setup();
    const sub = defaultSubscriptions[0];

    component.onFrequencyChange(sub, SubscriptionFrequency.Instant);

    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateProviderSubscription({
        providerType: CurrentResourceType.Preprints,
        providerId,
        subscriptionId: sub.id,
        frequency: SubscriptionFrequency.Instant,
      })
    );
    expect(toastService.showSuccess).toHaveBeenCalledWith('moderation.notificationPreferences.successUpdate');
  });

  it('should not dispatch UpdateProviderSubscription when frequency does not change', () => {
    setup();
    const sub = defaultSubscriptions[0];

    component.onFrequencyChange(sub, sub.frequency);

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should not dispatch UpdateProviderSubscription when route data is missing', () => {
    setup({ withResourceType: false });
    const sub = defaultSubscriptions[0];

    component.onFrequencyChange(sub, SubscriptionFrequency.Never);

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });
});
