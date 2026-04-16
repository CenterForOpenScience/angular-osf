import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContributorDialogComponent } from '@osf/shared/components/contributors/add-contributor-dialog/add-contributor-dialog.component';
import { AddContributorType } from '@osf/shared/enums/contributors/add-contributor-type.enum';
import { AddDialogState } from '@osf/shared/enums/contributors/add-dialog-state.enum';
import { ComponentCheckboxItemModel } from '@shared/models/component-checkbox-item.model';
import { ContributorAddModel } from '@shared/models/contributors/contributor-add.model';
import { ClearUsers, ContributorsSelectors, SearchUsers, SearchUsersPageChange } from '@shared/stores/contributors';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('AddContributorDialogComponent', () => {
  let component: AddContributorDialogComponent;
  let fixture: ComponentFixture<AddContributorDialogComponent>;
  let store: Store;
  let dialogRef: DynamicDialogRef;

  interface SetupOverrides {
    data?: {
      components: ComponentCheckboxItemModel[];
      resourceName: string;
      parentResourceName: string;
      allowAddingContributorsFromParentProject: boolean;
    };
    usersNextLink?: string | null;
    usersPreviousLink?: string | null;
  }

  const defaultComponents: ComponentCheckboxItemModel[] = [
    { id: 'root', title: 'Root', checked: true, disabled: false, isCurrent: true },
    { id: 'child-1', title: 'Child 1', checked: true, disabled: false },
    { id: 'child-2', title: 'Child 2', checked: false, disabled: false },
  ];

  const defaultDialogData = {
    components: defaultComponents,
    resourceName: 'Project A',
    parentResourceName: 'Parent Project',
    allowAddingContributorsFromParentProject: true,
  };

  function setup(overrides: SetupOverrides = {}) {
    const usersNextLink = 'usersNextLink' in overrides ? overrides.usersNextLink : 'next-link';
    const usersPreviousLink = 'usersPreviousLink' in overrides ? overrides.usersPreviousLink : 'prev-link';

    TestBed.configureTestingModule({
      imports: [AddContributorDialogComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, { data: overrides.data ?? defaultDialogData }),
        provideMockStore({
          signals: [
            { selector: ContributorsSelectors.getUsers, value: [] },
            { selector: ContributorsSelectors.isUsersLoading, value: false },
            { selector: ContributorsSelectors.getUsersTotalCount, value: 0 },
            { selector: ContributorsSelectors.getUsersNextLink, value: usersNextLink },
            { selector: ContributorsSelectors.getUsersPreviousLink, value: usersPreviousLink },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(AddContributorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    (store.dispatch as Mock).mockClear();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should initialize dialog data from config', () => {
    setup();
    expect(component.components()).toEqual(defaultComponents);
    expect(component.resourceName()).toBe('Project A');
    expect(component.parentResourceName()).toBe('Parent Project');
    expect(component.allowAddingContributorsFromParentProject()).toBe(true);
  });

  it('should clear users on destroy', () => {
    setup();
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(new ClearUsers());
  });

  it('should move from search to details state on addContributor', () => {
    setup();
    component.currentState.set(AddDialogState.Search);
    component.addContributor();
    expect(component.currentState()).toBe(AddDialogState.Details);
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close with registered contributors in details state when no additional components', () => {
    setup({
      data: {
        ...defaultDialogData,
        components: [{ id: 'root', title: 'Root', checked: true, disabled: false, isCurrent: true }],
      },
    });
    const users: ContributorAddModel[] = [
      { id: '1', fullName: 'A User', permission: 'write', isBibliographic: true, disabled: false },
      { id: '2', fullName: 'Disabled User', permission: 'read', isBibliographic: true, disabled: true },
    ];
    component.selectedUsers.set(users);
    component.currentState.set(AddDialogState.Details);

    component.addContributor();

    expect(component.currentState()).toBe(AddDialogState.Search);
    expect(dialogRef.close).toHaveBeenCalledWith({
      data: [{ id: '1', fullName: 'A User', permission: 'write', isBibliographic: true, disabled: false }],
      type: AddContributorType.Registered,
      childNodeIds: undefined,
    });
  });

  it('should move from details to components when there are multiple components', () => {
    setup();
    component.currentState.set(AddDialogState.Details);
    component.addContributor();
    expect(component.currentState()).toBe(AddDialogState.Components);
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close with selected child component ids in components state', () => {
    setup();
    component.selectedUsers.set([
      { id: '1', fullName: 'A User', permission: 'write', isBibliographic: true, disabled: false },
    ]);
    component.currentState.set(AddDialogState.Components);

    component.addContributor();

    expect(dialogRef.close).toHaveBeenCalledWith({
      data: [{ id: '1', fullName: 'A User', permission: 'write', isBibliographic: true, disabled: false }],
      type: AddContributorType.Registered,
      childNodeIds: ['child-1'],
    });
  });

  it('should close with parent project type', () => {
    setup();
    component.selectedUsers.set([
      { id: '1', fullName: 'A User', permission: 'write', isBibliographic: true, disabled: false },
    ]);

    component.addSourceProjectContributors();

    expect(dialogRef.close).toHaveBeenCalledWith({
      data: [{ id: '1', fullName: 'A User', permission: 'write', isBibliographic: true, disabled: false }],
      type: AddContributorType.ParentProject,
      childNodeIds: ['child-1'],
    });
  });

  it('should close with unregistered type', () => {
    setup();
    component.addUnregistered();
    expect(dialogRef.close).toHaveBeenCalledWith({
      data: [],
      type: AddContributorType.Unregistered,
    });
  });

  it('should search first page with trimmed value and reset pagination', () => {
    setup();
    component.currentPage.set(3);
    component.first.set(20);
    component.searchControl.setValue('  alice  ');

    component.pageChanged({ page: 0, first: 0 } as PaginatorState);

    expect(store.dispatch).toHaveBeenCalledWith(new SearchUsers('alice'));
    expect(component.currentPage()).toBe(1);
    expect(component.first()).toBe(0);
  });

  it('should dispatch page change action when moving to next page with link', () => {
    setup({ usersNextLink: 'next-link' });
    component.currentPage.set(1);

    component.pageChanged({ page: 1, first: 10 } as PaginatorState);

    expect(store.dispatch).toHaveBeenCalledWith(new SearchUsersPageChange('next-link'));
    expect(component.currentPage()).toBe(2);
    expect(component.first()).toBe(10);
  });

  it('should not dispatch page change when page link is missing', () => {
    setup({ usersNextLink: null });
    component.currentPage.set(1);

    component.pageChanged({ page: 1, first: 10 } as PaginatorState);

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(component.currentPage()).toBe(1);
    expect(component.first()).toBe(0);
  });

  it('should debounce and deduplicate search control dispatches', () => {
    vi.useFakeTimers();
    setup();
    component.selectedUsers.set([
      { id: '1', fullName: 'A User', permission: 'write', isBibliographic: true, disabled: false },
    ]);

    component.searchControl.setValue('john');
    vi.advanceTimersByTime(500);

    component.searchControl.setValue('john');
    vi.advanceTimersByTime(500);

    const dispatchMock = store.dispatch as Mock;
    expect(dispatchMock.mock.calls.filter((call) => call[0] instanceof SearchUsers).length).toBe(1);
    expect(component.isInitialState()).toBe(false);
    expect(component.selectedUsers()).toEqual([]);
    vi.useRealTimers();
  });
});
