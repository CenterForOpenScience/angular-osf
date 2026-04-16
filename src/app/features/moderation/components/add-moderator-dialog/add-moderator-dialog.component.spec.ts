import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';

import { AddModeratorType, ModeratorPermission } from '../../enums';
import { ModeratorAddModel, ModeratorDialogAddModel } from '../../models';
import { ClearUsers, ModeratorsSelectors, SearchUsers, SearchUsersPageChange } from '../../store/moderators';

import { AddModeratorDialogComponent } from './add-moderator-dialog.component';

describe('AddModeratorDialogComponent', () => {
  let component: AddModeratorDialogComponent;
  let fixture: ComponentFixture<AddModeratorDialogComponent>;
  let dialogRef: DynamicDialogRef;
  let store: Store;

  const mockUsers: ModeratorAddModel[] = [
    {
      id: 'u1',
      fullName: 'User One',
      email: 'user.one@example.org',
      permission: ModeratorPermission.Moderator,
    },
    {
      id: 'u2',
      fullName: 'User Two',
      email: 'user.two@example.org',
      permission: ModeratorPermission.Admin,
    },
  ];

  const defaultSignals: SignalOverride[] = [
    { selector: ModeratorsSelectors.getUsers, value: mockUsers },
    { selector: ModeratorsSelectors.isUsersLoading, value: false },
    { selector: ModeratorsSelectors.getUsersTotalCount, value: 20 },
    { selector: ModeratorsSelectors.getUsersNextLink, value: '/users?page=2' },
    { selector: ModeratorsSelectors.getUsersPreviousLink, value: '/users?page=1' },
  ];

  function setup(overrides: BaseSetupOverrides = {}) {
    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

    TestBed.configureTestingModule({
      imports: [AddModeratorDialogComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, { data: {} }),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(AddModeratorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should close with selected users on addModerator', () => {
    setup();
    component.selectedUsers.set([mockUsers[0]]);

    component.addModerator();

    const expected: ModeratorDialogAddModel = { data: [mockUsers[0]], type: AddModeratorType.Search };
    expect(dialogRef.close).toHaveBeenCalledWith(expected);
  });

  it('should close with invite type on inviteModerator', () => {
    setup();

    component.inviteModerator();

    const expected: ModeratorDialogAddModel = { data: [], type: AddModeratorType.Invite };
    expect(dialogRef.close).toHaveBeenCalledWith(expected);
  });

  it('should dispatch ClearUsers on destroy', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(new ClearUsers());
  });

  it('should dispatch SearchUsers for first page when search term exists', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    component.searchControl.setValue('alice');

    const pageEvent: PaginatorState = { page: 0, first: 0, rows: 10, pageCount: 2 };
    component.pageChanged(pageEvent);

    expect(store.dispatch).toHaveBeenCalledWith(new SearchUsers('alice'));
    expect(component.currentPage()).toBe(1);
    expect(component.first()).toBe(0);
  });

  it('should not dispatch first-page search when search term is empty', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    component.searchControl.setValue('   ');

    const pageEvent: PaginatorState = { page: 0, first: 0, rows: 10, pageCount: 2 };
    component.pageChanged(pageEvent);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch SearchUsersPageChange with next link', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    const pageEvent: PaginatorState = { page: 1, first: 10, rows: 10, pageCount: 2 };
    component.pageChanged(pageEvent);

    expect(store.dispatch).toHaveBeenCalledWith(new SearchUsersPageChange('/users?page=2'));
    expect(component.currentPage()).toBe(2);
    expect(component.first()).toBe(10);
  });

  it('should dispatch SearchUsersPageChange with previous link', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    component.currentPage.set(3);

    const pageEvent: PaginatorState = { page: 1, first: 10, rows: 10, pageCount: 3 };
    component.pageChanged(pageEvent);

    expect(store.dispatch).toHaveBeenCalledWith(new SearchUsersPageChange('/users?page=1'));
    expect(component.currentPage()).toBe(2);
    expect(component.first()).toBe(10);
  });

  it('should not dispatch page change when link is missing', () => {
    setup({
      selectorOverrides: [{ selector: ModeratorsSelectors.getUsersNextLink, value: null }],
    });
    (store.dispatch as Mock).mockClear();

    const pageEvent: PaginatorState = { page: 1, first: 10, rows: 10, pageCount: 2 };
    component.pageChanged(pageEvent);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should debounce search and clear selected users', () => {
    vi.useFakeTimers();
    setup();
    (store.dispatch as Mock).mockClear();
    component.selectedUsers.set([mockUsers[0]]);

    component.searchControl.setValue('john');
    vi.advanceTimersByTime(500);

    expect(store.dispatch).toHaveBeenCalledWith(new SearchUsers('john'));
    expect(component.isInitialState()).toBe(false);
    expect(component.selectedUsers()).toEqual([]);

    vi.useRealTimers();
  });

  it('should not dispatch duplicate consecutive search terms', () => {
    vi.useFakeTimers();
    setup();
    (store.dispatch as Mock).mockClear();

    component.searchControl.setValue('same');
    vi.advanceTimersByTime(500);
    component.searchControl.setValue('same');
    vi.advanceTimersByTime(500);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(new SearchUsers('same'));

    vi.useRealTimers();
  });
});
