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

import { ModeratorPermission } from '../../enums';
import { ModeratorModel } from '../../models';
import { ModeratorsSelectors } from '../../store/moderators';
import { ModeratorsTableComponent } from '../moderators-table/moderators-table.component';

import { ModeratorsListComponent } from './moderators-list.component';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { MOCK_MODERATORS } from '@testing/mocks/moderator.mock';
import { TranslateServiceMock } from '@testing/mocks/translate.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

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

  beforeAll(() => {
    if (typeof (globalThis as any).structuredClone !== 'function') {
      Object.defineProperty(globalThis as any, 'structuredClone', {
        configurable: true,
        writable: true,
        value: (o: unknown) => JSON.parse(JSON.stringify(o)),
      });
    }
  });

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: mockProviderId })
      .withData({ resourceType: mockResourceType })
      .build();
    customConfirmationServiceMock = CustomConfirmationServiceMockBuilder.create().build();
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        ModeratorsListComponent,
        OSFTestingModule,
        ...MockComponents(ModeratorsTableComponent, SearchInputComponent),
      ],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(CustomConfirmationService, customConfirmationServiceMock),
        MockProvider(CustomDialogService, mockCustomDialogService),
        TranslateServiceMock,
        provideMockStore({
          signals: [
            { selector: UserSelectors.getCurrentUser, value: mockCurrentUser },
            { selector: ModeratorsSelectors.getModerators, value: mockModerators },
            { selector: ProviderSelectors.hasAdminAccess, value: false },
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
