import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';

import { ModeratorAddModel } from '../../models';
import { ModeratorsSelectors } from '../../store/moderators';

import { AddModeratorDialogComponent } from './add-moderator-dialog.component';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { DynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('AddModeratorDialogComponent', () => {
  let component: AddModeratorDialogComponent;
  let fixture: ComponentFixture<AddModeratorDialogComponent>;
  let mockDialogRef: jest.Mocked<DynamicDialogRef>;
  let mockDialogConfig: jest.Mocked<DynamicDialogConfig>;

  const mockUsers = [MOCK_USER];

  beforeEach(async () => {
    mockDialogRef = DynamicDialogRefMock.useValue as unknown as jest.Mocked<DynamicDialogRef>;

    mockDialogConfig = {
      data: [],
    } as jest.Mocked<DynamicDialogConfig>;

    await TestBed.configureTestingModule({
      imports: [
        AddModeratorDialogComponent,
        OSFTestingModule,
        ...MockComponents(SearchInputComponent, LoadingSpinnerComponent, CustomPaginatorComponent),
      ],
      providers: [
        DynamicDialogRefMock,
        MockProvider(DynamicDialogConfig, mockDialogConfig),
        provideMockStore({
          signals: [
            { selector: ModeratorsSelectors.getUsers, value: mockUsers },
            { selector: ModeratorsSelectors.isUsersLoading, value: false },
            { selector: ModeratorsSelectors.getUsersTotalCount, value: 2 },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddModeratorDialogComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    fixture.detectChanges();

    expect(component.isInitialState()).toBe(true);
    expect(component.currentPage()).toBe(1);
    expect(component.first()).toBe(0);
    expect(component.rows()).toBe(10);
    expect(component.selectedUsers()).toEqual([]);
    expect(component.searchControl.value).toBe('');
  });

  it('should load users on initialization', () => {
    fixture.detectChanges();

    expect(component.users()).toEqual(mockUsers);
    expect(component.isLoading()).toBe(false);
    expect(component.totalUsersCount()).toBe(2);
  });

  it('should add moderator', () => {
    const mockSelectedUsers: ModeratorAddModel[] = [
      {
        id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        permission: 'read' as any,
      },
    ];
    component.selectedUsers.set(mockSelectedUsers);

    component.addModerator();

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      data: mockSelectedUsers,
      type: 1,
    });
  });

  it('should invite moderator', () => {
    component.inviteModerator();

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      data: [],
      type: 2,
    });
  });

  it('should handle page change correctly', () => {
    const mockEvent = { page: 1, first: 10, rows: 10 };
    const searchUsersSpy = jest.fn();
    component.actions = {
      ...component.actions,
      searchUsers: searchUsersSpy,
    };

    component.pageChanged(mockEvent);

    expect(component.currentPage()).toBe(2);
    expect(component.first()).toBe(10);
    expect(searchUsersSpy).toHaveBeenCalledWith('', 2);
  });

  it('should handle page change when page is null', () => {
    const mockEvent = { page: undefined, first: 0, rows: 10 };
    const searchUsersSpy = jest.fn();
    component.actions = {
      ...component.actions,
      searchUsers: searchUsersSpy,
    };

    component.pageChanged(mockEvent);

    expect(component.currentPage()).toBe(1);
    expect(component.first()).toBe(0);
    expect(searchUsersSpy).toHaveBeenCalledWith('', 1);
  });

  it('should clear users on destroy', () => {
    const clearUsersSpy = jest.fn();
    component.actions = {
      ...component.actions,
      clearUsers: clearUsersSpy,
    };

    component.ngOnDestroy();

    expect(clearUsersSpy).toHaveBeenCalled();
  });

  it('should have actions defined', () => {
    expect(component.actions).toBeDefined();
    expect(component.actions.searchUsers).toBeDefined();
    expect(component.actions.clearUsers).toBeDefined();
  });

  it('should handle search control value changes', () => {
    jest.useFakeTimers();
    fixture.detectChanges();
    const searchUsersSpy = jest.fn().mockReturnValue(of({}));
    component.actions = {
      ...component.actions,
      searchUsers: searchUsersSpy,
    };

    component.searchControl.setValue('test search');

    jest.advanceTimersByTime(600);

    expect(searchUsersSpy).toHaveBeenCalledWith('test search', 1);
    expect(component.isInitialState()).toBe(false);
    expect(component.selectedUsers()).toEqual([]);

    jest.useRealTimers();
  });

  it('should not search when search term is empty', () => {
    fixture.detectChanges();
    const searchUsersSpy = jest.fn();
    component.actions = {
      ...component.actions,
      searchUsers: searchUsersSpy,
    };

    component.searchControl.setValue('');
    component.searchControl.setValue('   ');

    expect(searchUsersSpy).not.toHaveBeenCalled();
  });
});
