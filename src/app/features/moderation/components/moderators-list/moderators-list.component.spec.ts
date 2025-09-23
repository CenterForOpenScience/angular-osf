import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { ModeratorsTableComponent } from '@osf/features/moderation/components';
import { ResourceType } from '@osf/shared/enums';
import { SearchInputComponent } from '@shared/components';
import { MOCK_USER, TranslateServiceMock } from '@shared/mocks';
import { CustomConfirmationService } from '@shared/services';

import { ModeratorPermission } from '../../enums';
import { ModeratorModel } from '../../models';
import { ModeratorsSelectors } from '../../store/moderators';

import { ModeratorsListComponent } from './moderators-list.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('Component: Moderators List', () => {
  let component: ModeratorsListComponent;
  let fixture: ComponentFixture<ModeratorsListComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let customConfirmationServiceMock: ReturnType<CustomConfirmationServiceMockBuilder['build']>;

  const mockProviderId = 'test-provider-123';
  const mockResourceType = ResourceType.Preprint;
  const mockCurrentUser = MOCK_USER;

  const mockModerators: ModeratorModel[] = [
    {
      id: '1',
      userId: 'user-1',
      fullName: 'John Doe',
      email: 'john@example.com',
      permission: ModeratorPermission.Admin,
      isActive: true,
    },
    {
      id: '2',
      userId: 'user-2',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      permission: ModeratorPermission.Read,
      isActive: true,
    },
  ];

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: mockProviderId })
      .withData({ resourceType: mockResourceType })
      .build();
    customConfirmationServiceMock = CustomConfirmationServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        ModeratorsListComponent,
        OSFTestingModule,
        ...MockComponents(ModeratorsTableComponent, SearchInputComponent),
      ],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(CustomConfirmationService, customConfirmationServiceMock),
        TranslateServiceMock,
        provideMockStore({
          signals: [
            { selector: UserSelectors.getCurrentUser, value: mockCurrentUser },
            { selector: ModeratorsSelectors.getModerators, value: mockModerators },
            { selector: ModeratorsSelectors.isModeratorsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

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
      permission: ModeratorPermission.Read,
    }));

    Object.defineProperty(component, 'initialModerators', {
      value: () => nonAdminModerators,
      writable: true,
    });

    fixture.detectChanges();

    expect(component.isCurrentUserAdminModerator()).toBe(false);
  });

  it('should return false for admin moderator when user is not found', () => {
    Object.defineProperty(component, 'currentUser', {
      value: () => null,
      writable: true,
    });

    fixture.detectChanges();

    expect(component.isCurrentUserAdminModerator()).toBe(false);
  });

  it('should load moderators on initialization', () => {
    const loadModeratorsSpy = jest.fn();
    component.actions = {
      ...component.actions,
      loadModerators: loadModeratorsSpy,
    };

    component.ngOnInit();

    expect(loadModeratorsSpy).toHaveBeenCalledWith(mockProviderId, mockResourceType);
  });

  it('should set search subscription on initialization', () => {
    const setSearchSubscriptionSpy = jest.fn();
    (component as any).setSearchSubscription = setSearchSubscriptionSpy;

    component.ngOnInit();

    expect(setSearchSubscriptionSpy).toHaveBeenCalled();
  });

  it('should handle search control value changes', () => {
    jest.useFakeTimers();
    fixture.detectChanges();
    const updateSearchValueSpy = jest.fn();
    const loadModeratorsSpy = jest.fn().mockReturnValue(of({}));
    component.actions = {
      ...component.actions,
      updateSearchValue: updateSearchValueSpy,
      loadModerators: loadModeratorsSpy,
    };

    component.searchControl.setValue('test search');

    jest.advanceTimersByTime(600);

    expect(updateSearchValueSpy).toHaveBeenCalledWith('test search');
    expect(loadModeratorsSpy).toHaveBeenCalledWith(mockProviderId, mockResourceType);

    jest.useRealTimers();
  });

  it('should handle empty search value', () => {
    jest.useFakeTimers();
    fixture.detectChanges();
    const updateSearchValueSpy = jest.fn();
    const loadModeratorsSpy = jest.fn().mockReturnValue(of({}));
    component.actions = {
      ...component.actions,
      updateSearchValue: updateSearchValueSpy,
      loadModerators: loadModeratorsSpy,
    };

    component.searchControl.setValue('');

    jest.advanceTimersByTime(600);

    expect(updateSearchValueSpy).toHaveBeenCalledWith(null);
    expect(loadModeratorsSpy).toHaveBeenCalledWith(mockProviderId, mockResourceType);

    jest.useRealTimers();
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
        permission: ModeratorPermission.Read,
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
