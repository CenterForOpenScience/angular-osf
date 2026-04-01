import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { SUBSCRIPTION_FREQUENCY_OPTIONS } from '@osf/shared/constants/subscription-options.const';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { SubscriptionEvent } from '@osf/shared/enums/subscriptions/subscription-event.enum';
import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';
import { NotificationSubscription } from '@osf/shared/models/notifications/notification-subscription.model';
import { ToastService } from '@osf/shared/services/toast.service';

import {
  GetProviderSubscriptions,
  ProviderSubscriptionsSelectors,
  UpdateProviderSubscription,
} from '../../store/provider-subscriptions';

import { NotificationSettingsComponent } from './notification-settings.component';

import { ToastServiceMock } from '@testing/mocks/toast.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

const MOCK_PROVIDER_SUBSCRIPTIONS: NotificationSubscription[] = [
  {
    id: 'sub-1',
    event: SubscriptionEvent.ProviderNewPendingSubmissions,
    frequency: SubscriptionFrequency.Instant,
  },
  {
    id: 'sub-2',
    event: SubscriptionEvent.ProviderNewPendingWithdrawRequests,
    frequency: SubscriptionFrequency.Never,
  },
];

async function createComponent(resourceType: CurrentResourceType, providerId = 'test-provider-123') {
  const mockActivatedRoute = ActivatedRouteMockBuilder.create()
    .withParams({ providerId })
    .withData({ resourceType })
    .build();

  await TestBed.configureTestingModule({
    imports: [NotificationSettingsComponent, OSFTestingModule],
    providers: [
      MockProvider(ActivatedRoute, mockActivatedRoute),
      ToastServiceMock,
      provideMockStore({
        signals: [
          { selector: ProviderSubscriptionsSelectors.getSubscriptions, value: MOCK_PROVIDER_SUBSCRIPTIONS },
          { selector: ProviderSubscriptionsSelectors.isLoading, value: false },
        ],
      }),
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(NotificationSettingsComponent);
  const component = fixture.componentInstance;
  const toastService = TestBed.inject(ToastService) as jest.Mocked<ToastService>;
  const store = TestBed.inject(Store);

  return { fixture, component, toastService, store };
}

describe('NotificationSettingsComponent', () => {
  let component: NotificationSettingsComponent;
  let fixture: ComponentFixture<NotificationSettingsComponent>;
  let toastService: jest.Mocked<ToastService>;
  let store: Store;

  const mockProviderId = 'test-provider-123';

  beforeEach(async () => {
    ({ fixture, component, toastService, store } = await createComponent(
      CurrentResourceType.Preprints,
      mockProviderId
    ));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should read providerId and resourceType from route', () => {
    fixture.detectChanges();
    expect(component.providerId()).toBe(mockProviderId);
    expect(component.resourceType()).toBe(CurrentResourceType.Preprints);
  });

  it('should dispatch GetProviderSubscriptions on init', () => {
    fixture.detectChanges();
    expect(store.dispatch as jest.Mock).toHaveBeenCalledWith(
      new GetProviderSubscriptions(CurrentResourceType.Preprints, mockProviderId)
    );
  });

  it('should dispatch UpdateProviderSubscription and show toast on frequency change', () => {
    fixture.detectChanges();

    component.onFrequencyChange(MOCK_PROVIDER_SUBSCRIPTIONS[0], SubscriptionFrequency.Daily);

    expect(store.dispatch as jest.Mock).toHaveBeenCalledWith(
      new UpdateProviderSubscription({
        providerType: CurrentResourceType.Preprints,
        providerId: mockProviderId,
        subscriptionId: 'sub-1',
        frequency: SubscriptionFrequency.Daily,
      })
    );
    expect(toastService.showSuccess).toHaveBeenCalledWith('moderation.notificationPreferences.successUpdate');
  });

  it('should not dispatch UpdateProviderSubscription if frequency is unchanged', () => {
    fixture.detectChanges();

    component.onFrequencyChange(MOCK_PROVIDER_SUBSCRIPTIONS[0], SubscriptionFrequency.Instant);

    expect(store.dispatch as jest.Mock).not.toHaveBeenCalledWith(expect.any(UpdateProviderSubscription));
  });

  it('should expose frequencyOptions from SUBSCRIPTION_FREQUENCY_OPTIONS', () => {
    expect(component.frequencyOptions).toEqual(SUBSCRIPTION_FREQUENCY_OPTIONS);
  });

  it('should populate form controls when subscriptions load', () => {
    fixture.detectChanges();
    expect(component.form.contains('sub-1')).toBe(true);
    expect(component.form.contains('sub-2')).toBe(true);
    expect(component.form.get('sub-1')?.value).toBe(SubscriptionFrequency.Instant);
    expect(component.form.get('sub-2')?.value).toBe(SubscriptionFrequency.Never);
  });
});
