import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';

import { signal } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';

import { AddModeratorType } from '../../enums';
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
  let dialogRef: jest.Mocked<DynamicDialogRef>;
  let dialogConfig: DynamicDialogConfig;
  let store: Store;

  const mockUsers = [MOCK_USER];

  beforeEach(async () => {
    dialogRef = DynamicDialogRefMock.useValue as unknown as jest.Mocked<DynamicDialogRef>;

    dialogConfig = {
      data: [],
    } as DynamicDialogConfig;

    await TestBed.configureTestingModule({
      imports: [
        AddModeratorDialogComponent,
        OSFTestingModule,
        ...MockComponents(SearchInputComponent, LoadingSpinnerComponent, CustomPaginatorComponent),
      ],
      providers: [
        DynamicDialogRefMock,
        MockProvider(DynamicDialogConfig, dialogConfig),
        provideMockStore({
          signals: [
            { selector: ModeratorsSelectors.getUsers, value: signal(mockUsers) },
            { selector: ModeratorsSelectors.isUsersLoading, value: false },
            { selector: ModeratorsSelectors.getUsersTotalCount, value: 2 },
            { selector: ModeratorsSelectors.getUsersNextLink, value: signal(null) },
            { selector: ModeratorsSelectors.getUsersPreviousLink, value: signal(null) },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(AddModeratorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isInitialState()).toBe(true);
    expect(component.currentPage()).toBe(1);
    expect(component.first()).toBe(0);
    expect(component.rows()).toBe(10);
    expect(component.selectedUsers()).toEqual([]);
    expect(component.searchControl.value).toBe('');
  });

  it('should load users from store', () => {
    expect(component.users()).toEqual(mockUsers);
    expect(component.isLoading()).toBe(false);
    expect(component.totalUsersCount()).toBe(2);
  });

  it('should close dialog with correct data for addModerator', () => {
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

    expect(dialogRef.close).toHaveBeenCalledWith({
      data: mockSelectedUsers,
      type: AddModeratorType.Search,
    });
  });

  it('should close dialog with correct data for inviteModerator', () => {
    component.inviteModerator();

    expect(dialogRef.close).toHaveBeenCalledWith({
      data: [],
      type: AddModeratorType.Invite,
    });
  });

  it('should handle pagination correctly', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.pageChanged({ first: 0 } as PaginatorState);
    expect(dispatchSpy).not.toHaveBeenCalled();

    component.searchControl.setValue('test');
    component.pageChanged({ page: 0, first: 0, rows: 10 } as PaginatorState);
    expect(dispatchSpy).toHaveBeenCalled();
    expect(component.currentPage()).toBe(1);
    expect(component.first()).toBe(0);
  });

  it('should navigate to next page when link is available', () => {
    const nextLink = 'http://api.example.com/users?page=3';
    const originalSelect = store.select.bind(store);
    (store.select as jest.Mock) = jest.fn((selector) => {
      if (selector === ModeratorsSelectors.getUsersNextLink) {
        return signal(nextLink);
      }
      return originalSelect(selector);
    });

    Object.defineProperty(component, 'usersNextLink', {
      get: () => signal(nextLink),
      configurable: true,
    });

    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.currentPage.set(2);
    component.pageChanged({ page: 2, first: 20, rows: 10 } as PaginatorState);

    expect(dispatchSpy).toHaveBeenCalled();
    expect(component.currentPage()).toBe(3);
    expect(component.first()).toBe(20);
  });

  it('should debounce and filter search input', fakeAsync(() => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.searchControl.setValue('t');
    tick(200);
    component.searchControl.setValue('test');
    tick(500);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(component.isInitialState()).toBe(false);
    expect(component.selectedUsers()).toEqual([]);
  }));

  it('should not search empty or whitespace values', fakeAsync(() => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.searchControl.setValue('');
    tick(500);
    expect(dispatchSpy).not.toHaveBeenCalled();

    component.searchControl.setValue('   ');
    tick(500);
    expect(dispatchSpy).not.toHaveBeenCalled();
  }));

  it('should clear users on destroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalled();
  });
});
