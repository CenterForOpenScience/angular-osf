import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { UserSelectors } from '@osf/core/store/user';
import { LoaderService, ToastService } from '@osf/shared/services';
import { SubscriptionEvent, SubscriptionFrequency } from '@shared/enums';
import { MOCK_STORE, MOCK_USER, TranslateServiceMock } from '@shared/mocks';

import { AccountSettings } from '../account-settings/models';
import { AccountSettingsSelectors } from '../account-settings/store';

import { NotificationsComponent } from './notifications.component';
import { NotificationSubscriptionSelectors } from './store';

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

  const mockNotificationSubscriptions = [
    { id: 'id1', event: SubscriptionEvent.GlobalMentions, frequency: SubscriptionFrequency.Daily },
    {
      id: 'id2',
      event: SubscriptionEvent.GlobalMentions,
      frequency: SubscriptionFrequency.Instant,
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

    MOCK_STORE.dispatch.mockImplementation(() => of());

    await TestBed.configureTestingModule({
      imports: [NotificationsComponent, MockPipe(TranslatePipe), ReactiveFormsModule],
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

    expect(loaderService.hide).not.toHaveBeenCalled();
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
    const event = SubscriptionEvent.GlobalMentions;
    const frequency = SubscriptionFrequency.Daily;

    component.onSubscriptionChange(event, frequency);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
