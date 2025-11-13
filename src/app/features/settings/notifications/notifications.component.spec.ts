import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { UserSelectors } from '@osf/core/store/user';
import { InfoIconComponent } from '@osf/shared/components/info-icon/info-icon.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { SubscriptionEvent } from '@osf/shared/enums/subscriptions/subscription-event.enum';
import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { AccountSettings } from '../account-settings/models';
import { AccountSettingsSelectors } from '../account-settings/store';

import { NotificationsComponent } from './notifications.component';
import { NotificationSubscriptionSelectors } from './store';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { MOCK_STORE } from '@testing/mocks/mock-store.mock';
import { TranslateServiceMock } from '@testing/mocks/translate.service.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let loaderService: LoaderService;
  let toastServiceMock: ReturnType<ToastServiceMockBuilder['build']>;

  const mockUserSettings: Partial<AccountSettings> = {
    subscribeOsfGeneralEmail: true,
    subscribeOsfHelpEmail: false,
  };

  // new_pending_submissions → global_reviews
  // files_updated → global_file_updated
  const mockNotificationSubscriptions = [
    {
      id: 'osf_new_pending_submissions',
      event: 'new_pending_submissions',
      frequency: SubscriptionFrequency.Instant,
    },
    {
      id: 'cuzg4_global_file_updated',
      event: 'files_updated',
      frequency: SubscriptionFrequency.Daily,
    },
  ];

  beforeEach(async () => {
    toastServiceMock = ToastServiceMockBuilder.create().build();

    const mockLoaderService = {
      show: jest.fn(),
      hide: jest.fn(),
    };

    MOCK_STORE.selectSignal.mockImplementation((selector) => {
      if (selector === UserSelectors.getCurrentUser) {
        return signal(MOCK_USER);
      }
      if (selector === AccountSettingsSelectors.getAccountSettings) {
        return signal(mockUserSettings);
      }
      if (selector === NotificationSubscriptionSelectors.getAllGlobalNotificationSubscriptions) {
        return signal(mockNotificationSubscriptions);
      }
      if (selector === AccountSettingsSelectors.areAccountSettingsLoading) {
        return signal(false);
      }
      if (selector === NotificationSubscriptionSelectors.isLoading) {
        return signal(false);
      }
      return signal(null);
    });

    MOCK_STORE.dispatch.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        NotificationsComponent,
        ...MockComponents(InfoIconComponent, SubHeaderComponent),
        MockPipe(TranslatePipe),
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TranslateServiceMock,
        MockProvider(Store, MOCK_STORE),
        MockProvider(LoaderService, mockLoaderService),
        MockProvider(ToastService, toastServiceMock),
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;

    loaderService = TestBed.inject(LoaderService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call loader hide when no user exists', () => {
    MOCK_STORE.selectSignal.mockImplementation((selector) => {
      if (selector === UserSelectors.getCurrentUser) {
        return signal(null);
      }

      return signal(null);
    });

    component.emailPreferencesFormSubmit();
    expect(loaderService.hide).toHaveBeenCalledTimes(1);
  });

  it('should handle subscription completion correctly', () => {
    const mockDispatch = jest.fn().mockReturnValue(of({}));
    MOCK_STORE.dispatch.mockImplementation(mockDispatch);

    component.emailPreferencesFormSubmit();

    const subscription = mockDispatch.mock.results[0].value;
    subscription.subscribe(() => {
      expect(loaderService.hide).toHaveBeenCalledTimes(1);
    });
  });

  it('should call dispatch only once per subscription change', () => {
    const mockDispatch = jest.fn().mockReturnValue(of({}));
    MOCK_STORE.dispatch.mockImplementation(mockDispatch);

    component.onSubscriptionChange(SubscriptionEvent.GlobalFileUpdated, SubscriptionFrequency.Daily);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should default to API value', () => {
    const subs = component.notificationSubscriptionsForm.value;

    expect(subs.global_reviews).toBe(SubscriptionFrequency.Instant);

    expect(subs.global_file_updated).toBe(SubscriptionFrequency.Daily);
  });
});
