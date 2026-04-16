import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ProviderSelectors } from '@core/store/provider';
import { UserSelectors } from '@core/store/user';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { MOCK_MODERATORS } from '@testing/mocks/moderator.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { ModeratorPermission } from '../../enums';
import { ModeratorModel } from '../../models';
import { ModeratorsSelectors } from '../../store/moderators';
import { ModeratorsTableComponent } from '../moderators-table/moderators-table.component';

import { ModeratorsListComponent } from './moderators-list.component';

describe('ModeratorsListComponent', () => {
  let component: ModeratorsListComponent;
  let fixture: ComponentFixture<ModeratorsListComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let customConfirmationServiceMock: ReturnType<CustomConfirmationServiceMockBuilder['build']>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;

  const mockProviderId = 'test-provider-123';
  const mockResourceType = ResourceType.Preprint;
  const mockCurrentUser = MOCK_USER;

  const mockModerators: ModeratorModel[] = MOCK_MODERATORS;

  beforeEach(() => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: mockProviderId })
      .withData({ resourceType: mockResourceType })
      .build();
    customConfirmationServiceMock = CustomConfirmationServiceMockBuilder.create().build();
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();

    TestBed.configureTestingModule({
      imports: [ModeratorsListComponent, ...MockComponents(ModeratorsTableComponent, SearchInputComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(CustomConfirmationService, customConfirmationServiceMock),
        MockProvider(CustomDialogService, mockCustomDialogService),
        MockProvider(ToastService),
        provideMockStore({
          signals: [
            { selector: UserSelectors.getCurrentUser, value: mockCurrentUser },
            { selector: ModeratorsSelectors.getModerators, value: mockModerators },
            { selector: ProviderSelectors.hasAdminAccess, value: false },
            { selector: ModeratorsSelectors.isModeratorsLoading, value: false },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(ModeratorsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with correct values', () => {
    fixture.detectChanges();

    expect(component.providerId()).toBe(mockProviderId);
    expect(component.resourceType()).toBe(mockResourceType);
    expect(component.searchControl.value).toBe('');
    expect(component.moderators()).toEqual(mockModerators);
    expect(component.isModeratorsLoading()).toBe(false);
    expect(component.currentUser()).toEqual(mockCurrentUser);
  });

  it('should return false for admin moderator when user is not admin', () => {
    const nonAdminModerators = mockModerators.map((mod) => ({
      ...mod,
      permission: ModeratorPermission.Moderator,
    }));

    Object.defineProperty(component, 'initialModerators', {
      value: () => nonAdminModerators,
      writable: true,
    });

    fixture.detectChanges();

    expect(component.hasAdminAccess()).toBe(false);
  });

  it('should return false for admin moderator when user is not found', () => {
    Object.defineProperty(component, 'currentUser', {
      value: () => null,
      writable: true,
    });

    fixture.detectChanges();

    expect(component.hasAdminAccess()).toBe(false);
  });

  it('should load moderators on initialization', () => {
    const loadModeratorsSpy = vi.fn();
    component.actions = {
      ...component.actions,
      loadModerators: loadModeratorsSpy,
    };

    component.ngOnInit();

    expect(loadModeratorsSpy).toHaveBeenCalledWith(mockProviderId, mockResourceType);
  });

  it('should set search subscription on initialization', () => {
    const setSearchSubscriptionSpy = vi.fn();
    (component as any).setSearchSubscription = setSearchSubscriptionSpy;

    component.ngOnInit();

    expect(setSearchSubscriptionSpy).toHaveBeenCalled();
  });

  it('should handle search control value changes', () => {
    vi.useFakeTimers();
    fixture.detectChanges();
    const updateSearchValueSpy = vi.fn();
    const loadModeratorsSpy = vi.fn().mockReturnValue(of({}));
    component.actions = {
      ...component.actions,
      updateSearchValue: updateSearchValueSpy,
      loadModerators: loadModeratorsSpy,
    };

    component.searchControl.setValue('test search');

    vi.advanceTimersByTime(600);

    expect(updateSearchValueSpy).toHaveBeenCalledWith('test search');
    expect(loadModeratorsSpy).toHaveBeenCalledWith(mockProviderId, mockResourceType);

    vi.useRealTimers();
  });

  it('should handle empty search value', () => {
    vi.useFakeTimers();
    fixture.detectChanges();
    const updateSearchValueSpy = vi.fn();
    const loadModeratorsSpy = vi.fn().mockReturnValue(of({}));
    component.actions = {
      ...component.actions,
      updateSearchValue: updateSearchValueSpy,
      loadModerators: loadModeratorsSpy,
    };

    component.searchControl.setValue('');

    vi.advanceTimersByTime(600);

    expect(updateSearchValueSpy).toHaveBeenCalledWith(null);
    expect(loadModeratorsSpy).toHaveBeenCalledWith(mockProviderId, mockResourceType);

    vi.useRealTimers();
  });

  it('should have actions defined', () => {
    expect(component.actions).toBeDefined();
    expect(component.actions.loadModerators).toBeDefined();
    expect(component.actions.updateSearchValue).toBeDefined();
    expect(component.actions.addModerators).toBeDefined();
    expect(component.actions.updateModerator).toBeDefined();
    expect(component.actions.deleteModerator).toBeDefined();
  });

  it('should update moderators when initial moderators change', () => {
    const newModerators = [
      ...mockModerators,
      {
        id: '3',
        userId: 'user-3',
        fullName: 'Bob Wilson',
        email: 'bob@example.com',
        permission: ModeratorPermission.Moderator,
        isActive: true,
      },
    ];

    Object.defineProperty(component, 'initialModerators', {
      value: () => newModerators,
      writable: true,
    });

    fixture.detectChanges();

    expect(component.moderators()).toEqual(newModerators);
  });
});
