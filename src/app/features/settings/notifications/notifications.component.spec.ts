import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@core/store/user';
import { InfoIconComponent } from '@osf/shared/components/info-icon/info-icon.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { SubscriptionEvent } from '@osf/shared/enums/subscriptions/subscription-event.enum';
import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';
import { NotificationSubscription } from '@osf/shared/models/notifications/notification-subscription.model';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { AccountSettings } from '../account-settings/models';
import { AccountSettingsSelectors, GetAccountSettings, UpdateAccountSettings } from '../account-settings/store';

import { EmailPreferencesFormControls } from './models';
import { NotificationsComponent } from './notifications.component';
import {
  GetAllGlobalNotificationSubscriptions,
  NotificationSubscriptionSelectors,
  UpdateNotificationSubscription,
} from './store';

interface SetupOverrides {
  selectorOverrides?: SignalOverride[];
  detectChanges?: boolean;
}

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let store: Store;
  let loaderService: LoaderServiceMock;
  let toastService: ToastServiceMockType;

  const mockEmailPreferences: AccountSettings = {
    twoFactorEnabled: false,
    twoFactorConfirmed: false,
    subscribeOsfGeneralEmail: true,
    subscribeOsfHelpEmail: false,
    deactivationRequested: false,
    contactedDeactivation: false,
    secret: '',
  };

  const mockNotificationSubscriptions: NotificationSubscription[] = [
    {
      id: '1_global_file_updated',
      event: SubscriptionEvent.GlobalFileUpdated,
      frequency: SubscriptionFrequency.Daily,
    },
    {
      id: '1_global_reviews',
      event: SubscriptionEvent.GlobalReviews,
      frequency: SubscriptionFrequency.Instant,
    },
  ];

  const defaultSignals: SignalOverride[] = [
    { selector: UserSelectors.getCurrentUser, value: MOCK_USER },
    { selector: AccountSettingsSelectors.getAccountSettings, value: mockEmailPreferences },
    {
      selector: NotificationSubscriptionSelectors.getAllGlobalNotificationSubscriptions,
      value: mockNotificationSubscriptions,
    },
    { selector: AccountSettingsSelectors.areAccountSettingsLoading, value: false },
    { selector: NotificationSubscriptionSelectors.isLoading, value: false },
  ];

  function setup(overrides: SetupOverrides = {}) {
    loaderService = new LoaderServiceMock();
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [NotificationsComponent, ...MockComponents(InfoIconComponent, SubHeaderComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(LoaderService, loaderService),
        MockProvider(ToastService, toastService),
        provideMockStore({
          signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides),
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;

    if (overrides.detectChanges !== false) {
      fixture.detectChanges();
    }
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should patch email preferences form from selector data', () => {
    setup();

    expect(component.emailPreferencesForm.get(EmailPreferencesFormControls.SubscribeOsfGeneralEmail)?.value).toBe(true);
    expect(component.emailPreferencesForm.get(EmailPreferencesFormControls.SubscribeOsfHelpEmail)?.value).toBe(false);
  });

  it('should patch notification subscriptions form from selector data', () => {
    setup();

    expect(component.notificationSubscriptionsForm.get(SubscriptionEvent.GlobalFileUpdated)?.value).toBe(
      SubscriptionFrequency.Daily
    );
    expect(component.notificationSubscriptionsForm.get(SubscriptionEvent.GlobalReviews)?.value).toBe(
      SubscriptionFrequency.Instant
    );
  });

  it('should dispatch notification and account settings fetches on init when data is missing', () => {
    setup({
      selectorOverrides: [
        { selector: AccountSettingsSelectors.getAccountSettings, value: null },
        { selector: NotificationSubscriptionSelectors.getAllGlobalNotificationSubscriptions, value: [] },
      ],
      detectChanges: false,
    });

    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(new GetAllGlobalNotificationSubscriptions());
    expect(store.dispatch).toHaveBeenCalledWith(new GetAccountSettings());
  });

  it('should not dispatch initial fetches on init when data already exists', () => {
    setup({ detectChanges: false });
    (store.dispatch as Mock).mockClear();

    component.ngOnInit();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetAllGlobalNotificationSubscriptions));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetAccountSettings));
  });

  it('should not submit email preferences when current user is missing', () => {
    setup({
      selectorOverrides: [{ selector: UserSelectors.getCurrentUser, value: null }],
    });
    (store.dispatch as Mock).mockClear();

    component.emailPreferencesFormSubmit();

    expect(loaderService.show).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdateAccountSettings));
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should submit email preferences and show success toast when current user exists', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    component.emailPreferencesForm.patchValue({
      subscribeOsfGeneralEmail: false,
      subscribeOsfHelpEmail: true,
    });

    component.emailPreferencesFormSubmit();

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateAccountSettings({
        subscribeOsfGeneralEmail: false,
        subscribeOsfHelpEmail: true,
      })
    );
    expect(loaderService.hide).toHaveBeenCalled();
    expect(toastService.showSuccess).toHaveBeenCalledWith('settings.notifications.emailPreferences.successUpdate');
  });

  it('should not update subscription when current user is missing', () => {
    setup({
      selectorOverrides: [{ selector: UserSelectors.getCurrentUser, value: null }],
    });
    (store.dispatch as Mock).mockClear();

    component.onSubscriptionChange(SubscriptionEvent.GlobalFileUpdated, SubscriptionFrequency.Instant);

    expect(loaderService.show).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdateNotificationSubscription));
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should update notification subscription and show success toast', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.onSubscriptionChange(SubscriptionEvent.GlobalFileUpdated, SubscriptionFrequency.Instant);

    expect(loaderService.show).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateNotificationSubscription({
        id: '1_global_file_updated',
        frequency: SubscriptionFrequency.Instant,
      })
    );
    expect(loaderService.hide).toHaveBeenCalled();
    expect(toastService.showSuccess).toHaveBeenCalledWith(
      'settings.notifications.notificationPreferences.successUpdate'
    );
  });
});
