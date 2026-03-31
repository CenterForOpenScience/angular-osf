import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { SubscriptionEvent } from '@osf/shared/enums/subscriptions/subscription-event.enum';
import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';
import { NotificationSubscription } from '@osf/shared/models/notifications/notification-subscription.model';
import { ToastService } from '@osf/shared/services/toast.service';

import { ProviderSubscriptionsSelectors } from '../../store/provider-subscriptions';

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

async function createComponent(resourceType: ResourceType, providerId = 'test-provider-123') {
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

  return { fixture, component, toastService };
}

describe('NotificationSettingsComponent', () => {
  let component: NotificationSettingsComponent;
  let fixture: ComponentFixture<NotificationSettingsComponent>;
  let toastService: jest.Mocked<ToastService>;

  const mockProviderId = 'test-provider-123';

  beforeEach(async () => {
    ({ fixture, component, toastService } = await createComponent(ResourceType.Preprint, mockProviderId));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should read providerId and resourceType from route', () => {
    fixture.detectChanges();
    expect(component.providerId()).toBe(mockProviderId);
    expect(component.resourceType()).toBe(ResourceType.Preprint);
  });

  it('should compute providerType as preprints for ResourceType.Preprint', () => {
    fixture.detectChanges();
    expect(component.providerType()).toBe('preprints');
  });

  it('should dispatch GetProviderSubscriptions on init', () => {
    const getProviderSubscriptionsSpy = jest.fn().mockReturnValue(of({}));
    component.actions = { ...component.actions, getProviderSubscriptions: getProviderSubscriptionsSpy };

    component.ngOnInit();

    expect(getProviderSubscriptionsSpy).toHaveBeenCalledWith('preprints', mockProviderId);
  });

  it('should return correct labelKey for a subscription event', () => {
    expect(component.labelKey(SubscriptionEvent.ProviderNewPendingSubmissions)).toBe(
      'moderation.notificationPreferences.items.provider_new_pending_submissions'
    );
  });

  it('should dispatch UpdateProviderSubscription and show toast on frequency change', () => {
    fixture.detectChanges();
    const updateSpy = jest.fn().mockReturnValue(of({}));
    component.actions = { ...component.actions, updateProviderSubscription: updateSpy };

    component.onFrequencyChange(MOCK_PROVIDER_SUBSCRIPTIONS[0], SubscriptionFrequency.Daily);

    expect(updateSpy).toHaveBeenCalledWith({
      providerType: 'preprints',
      providerId: mockProviderId,
      subscriptionId: 'sub-1',
      frequency: SubscriptionFrequency.Daily,
    });
    expect(toastService.showSuccess).toHaveBeenCalledWith('moderation.notificationPreferences.successUpdate');
  });

  it('should build frequencyOptions from SubscriptionFrequency enum', () => {
    expect(component.frequencyOptions).toEqual(
      Object.entries(SubscriptionFrequency).map(([key, value]) => ({ label: key, value }))
    );
  });

  it('should populate form controls when subscriptions load', () => {
    fixture.detectChanges();
    expect(component.form.contains('sub-1')).toBe(true);
    expect(component.form.contains('sub-2')).toBe(true);
    expect(component.form.get('sub-1')?.value).toBe(SubscriptionFrequency.Instant);
    expect(component.form.get('sub-2')?.value).toBe(SubscriptionFrequency.Never);
  });

  it('should have actions defined', () => {
    expect(component.actions).toBeDefined();
    expect(component.actions.getProviderSubscriptions).toBeDefined();
    expect(component.actions.updateProviderSubscription).toBeDefined();
  });
});
