import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContributorType } from '@osf/shared/enums/contributors/add-contributor-type.enum';
import { AddDialogState } from '@osf/shared/enums/contributors/add-dialog-state.enum';
import { ClearUsers, ContributorsSelectors, SearchUsers, SearchUsersPageChange } from '@osf/shared/stores/contributors';
import { ComponentCheckboxItemModel } from '@shared/models/component-checkbox-item.model';
import { ContributorAddModel } from '@shared/models/contributors/contributor-add.model';

import { ComponentsSelectionListComponent } from '../../components-selection-list/components-selection-list.component';
import { CustomPaginatorComponent } from '../../custom-paginator/custom-paginator.component';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { SearchInputComponent } from '../../search-input/search-input.component';
import { AddContributorItemComponent } from '../add-contributor-item/add-contributor-item.component';

import { AddContributorDialogComponent } from './add-contributor-dialog.component';

import {
  MOCK_COMPONENT_CHECKBOX_ITEM,
  MOCK_COMPONENT_CHECKBOX_ITEM_CURRENT,
  MOCK_COMPONENT_CHECKBOX_ITEM_UNCHECKED,
  MOCK_CONTRIBUTOR_ADD,
  MOCK_CONTRIBUTOR_ADD_DISABLED,
} from '@testing/mocks/contributors.mock';
import { provideDynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';

interface SetupOverrides extends BaseSetupOverrides {
  dialogData?: {
    components?: ComponentCheckboxItemModel[];
    resourceName?: string;
    parentResourceName?: string;
    allowAddingContributorsFromParentProject?: boolean;
  };
}

describe('AddContributorDialogComponent', () => {
  let component: AddContributorDialogComponent;
  let fixture: ComponentFixture<AddContributorDialogComponent>;
  let dialogRef: DynamicDialogRef;
  let store: Store;

  const users: ContributorAddModel[] = [
    {
      ...MOCK_CONTRIBUTOR_ADD,
      id: 'u1',
      fullName: 'User One',
      email: 'one@example.com',
      isBibliographic: false,
    },
    {
      ...MOCK_CONTRIBUTOR_ADD_DISABLED,
      id: 'u2',
      fullName: 'User Two',
      email: 'two@example.com',
      permission: 'read',
      checked: false,
    },
  ];

  const components: ComponentCheckboxItemModel[] = [
    { ...MOCK_COMPONENT_CHECKBOX_ITEM_CURRENT, id: 'n1', title: 'Current', checked: true },
    { ...MOCK_COMPONENT_CHECKBOX_ITEM, id: 'n2', title: 'Child A', checked: true },
    { ...MOCK_COMPONENT_CHECKBOX_ITEM_UNCHECKED, id: 'n3', title: 'Child B' },
  ];

  const singleComponent: ComponentCheckboxItemModel[] = [
    { id: 'n1', title: 'Current', checked: true, disabled: false, isCurrent: true },
  ];

  function setup(overrides: SetupOverrides = {}): void {
    const defaultSignals = [
      { selector: ContributorsSelectors.getUsers, value: users },
      { selector: ContributorsSelectors.isUsersLoading, value: false },
      { selector: ContributorsSelectors.getUsersTotalCount, value: 25 },
      { selector: ContributorsSelectors.getUsersNextLink, value: '/next' },
      { selector: ContributorsSelectors.getUsersPreviousLink, value: '/prev' },
    ];

    const dialogData = {
      components,
      resourceName: 'Resource Name',
      parentResourceName: 'Parent Name',
      allowAddingContributorsFromParentProject: true,
      ...overrides.dialogData,
    };

    TestBed.configureTestingModule({
      imports: [
        AddContributorDialogComponent,
        ...MockComponents(
          SearchInputComponent,
          LoadingSpinnerComponent,
          CustomPaginatorComponent,
          AddContributorItemComponent,
          ComponentsSelectionListComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, { data: dialogData }),
        provideMockStore({
          signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides),
        }),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(AddContributorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create and initialize dialog data', () => {
    setup();
    expect(component).toBeTruthy();
    expect(component.resourceName()).toBe('Resource Name');
    expect(component.parentResourceName()).toBe('Parent Name');
    expect(component.allowAddingContributorsFromParentProject()).toBe(true);
    expect(component.components()).toEqual(components);
  });

  it('should pre-populate selectedUsers with checked users from store', () => {
    const checkedUsers: ContributorAddModel[] = [
      {
        id: 'u5',
        fullName: 'Auto Selected',
        email: 'auto@example.com',
        permission: 'read',
        isBibliographic: false,
        checked: true,
        disabled: false,
      },
    ];
    setup({ selectorOverrides: [{ selector: ContributorsSelectors.getUsers, value: checkedUsers }] });
    expect(component.selectedUsers()).toEqual(checkedUsers);
  });

  it('should not overwrite selectedUsers when no store users are checked', () => {
    const uncheckedUsers: ContributorAddModel[] = [
      {
        id: 'u6',
        fullName: 'Not Checked',
        email: 'nc@example.com',
        permission: 'read',
        isBibliographic: false,
        checked: false,
        disabled: false,
      },
    ];
    setup({ selectorOverrides: [{ selector: ContributorsSelectors.getUsers, value: uncheckedUsers }] });
    expect(component.selectedUsers()).toEqual([]);
  });

  it('should move Search → Details and filter out disabled users', () => {
    setup();
    component.selectedUsers.set([...users]);
    component.addContributor();
    expect(component.currentState()).toBe(AddDialogState.Details);
    expect(component.selectedUsers()).toEqual([users[0]]);
  });

  it('should move Details → Components when multiple components exist', () => {
    setup();
    component.selectedUsers.set([users[0]]);
    component.currentState.set(AddDialogState.Details);
    component.addContributor();
    expect(component.currentState()).toBe(AddDialogState.Components);
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close and reset to Search from Details when no extra components', () => {
    setup({ dialogData: { components: singleComponent } });
    component.selectedUsers.set([...users]);
    component.currentState.set(AddDialogState.Details);
    component.addContributor();
    expect(component.currentState()).toBe(AddDialogState.Search);
    expect(dialogRef.close).toHaveBeenCalledWith({
      data: [users[0]],
      type: AddContributorType.Registered,
      childNodeIds: undefined,
    });
  });

  it('should close from Components with checked non-current child ids', () => {
    setup();
    component.selectedUsers.set([users[0]]);
    component.currentState.set(AddDialogState.Components);
    component.addContributor();
    expect(dialogRef.close).toHaveBeenCalledWith({
      data: [users[0]],
      type: AddContributorType.Registered,
      childNodeIds: ['n2'],
    });
  });

  it('should close from Components with childNodeIds undefined when no children are checked', () => {
    setup({ dialogData: { components: singleComponent } });
    component.selectedUsers.set([users[0]]);
    component.currentState.set(AddDialogState.Components);
    component.addContributor();
    expect(dialogRef.close).toHaveBeenCalledWith({
      data: [users[0]],
      type: AddContributorType.Registered,
      childNodeIds: undefined,
    });
  });

  it('should close with ParentProject type and child ids', () => {
    setup();
    component.selectedUsers.set([...users]);
    component.addSourceProjectContributors();
    expect(dialogRef.close).toHaveBeenCalledWith({
      data: [users[0]],
      type: AddContributorType.ParentProject,
      childNodeIds: ['n2'],
    });
  });

  it('should close with ParentProject type and undefined child ids when none selected', () => {
    setup({ dialogData: { components: singleComponent } });
    component.selectedUsers.set([users[0]]);
    component.addSourceProjectContributors();
    expect(dialogRef.close).toHaveBeenCalledWith({
      data: [users[0]],
      type: AddContributorType.ParentProject,
      childNodeIds: undefined,
    });
  });

  it('should close with Unregistered type and empty data', () => {
    setup();
    component.addUnregistered();
    expect(dialogRef.close).toHaveBeenCalledWith({
      data: [],
      type: AddContributorType.Unregistered,
    });
  });

  it('should do nothing when page is undefined', () => {
    setup();
    (store.dispatch as jest.Mock).mockClear();
    component.pageChanged({ first: 0 } as PaginatorState);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch SearchUsers and reset pagination when navigating to page 1', () => {
    setup();
    component.searchControl.setValue('john');
    component.currentPage.set(3);
    component.first.set(20);
    component.pageChanged({ page: 0, first: 0 });
    expect(store.dispatch).toHaveBeenCalledWith(new SearchUsers('john'));
    expect(component.currentPage()).toBe(1);
    expect(component.first()).toBe(0);
  });

  it('should do nothing on page 1 navigation when search term is empty', () => {
    setup();
    component.searchControl.setValue('');
    (store.dispatch as jest.Mock).mockClear();
    component.pageChanged({ page: 0, first: 0 });
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch next link and update page state when moving forward', () => {
    setup();
    component.currentPage.set(1);
    component.pageChanged({ page: 1, first: 10 });
    expect(store.dispatch).toHaveBeenCalledWith(new SearchUsersPageChange('/next'));
    expect(component.currentPage()).toBe(2);
    expect(component.first()).toBe(10);
  });

  it('should dispatch previous link and update page state when moving backward', () => {
    setup();
    component.currentPage.set(3);
    component.pageChanged({ page: 1, first: 10 });
    expect(store.dispatch).toHaveBeenCalledWith(new SearchUsersPageChange('/prev'));
    expect(component.currentPage()).toBe(2);
    expect(component.first()).toBe(10);
  });

  it.each([
    ['forward', 1, { selector: ContributorsSelectors.getUsersNextLink, value: null }],
    ['backward', 3, { selector: ContributorsSelectors.getUsersPreviousLink, value: null }],
  ])('should not dispatch when moving %s with no link available', (_, currentPage, selectorOverride) => {
    setup({ selectorOverrides: [selectorOverride] });
    component.currentPage.set(currentPage as number);
    (store.dispatch as jest.Mock).mockClear();
    component.pageChanged({ page: 1, first: 10 });
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch ClearUsers on destroy', () => {
    setup();
    (store.dispatch as jest.Mock).mockClear();
    fixture.destroy();
    expect(store.dispatch).toHaveBeenCalledWith(new ClearUsers());
  });

  it('should set isBibliographic to true and preserve all other fields', () => {
    setup();
    const selected: ContributorAddModel[] = [
      {
        id: 'u4',
        fullName: 'User Four',
        permission: 'write',
        email: 'four@example.com',
        isBibliographic: false,
        checked: true,
        disabled: false,
      },
    ];
    component.onSelectedUsersChange(selected);
    expect(component.selectedUsers()).toEqual([
      {
        id: 'u4',
        fullName: 'User Four',
        permission: 'write',
        email: 'four@example.com',
        isBibliographic: true,
        checked: true,
        disabled: false,
      },
    ]);
  });

  it('should debounce search, dispatch SearchUsers, and reset pagination and selection', () => {
    jest.useFakeTimers();
    try {
      setup();
      component.selectedUsers.set([users[0]]);
      component.currentPage.set(3);
      component.first.set(20);
      component.searchControl.setValue('query');
      jest.advanceTimersByTime(500);
      expect(store.dispatch).toHaveBeenCalledWith(new SearchUsers('query'));
      expect(component.isInitialState()).toBe(false);
      expect(component.selectedUsers()).toEqual([]);
      expect(component.currentPage()).toBe(1);
      expect(component.first()).toBe(0);
    } finally {
      jest.useRealTimers();
    }
  });

  it.each(['', '   '])('should not dispatch SearchUsers for blank input "%s"', (value) => {
    jest.useFakeTimers();
    try {
      setup();
      (store.dispatch as jest.Mock).mockClear();
      component.searchControl.setValue(value);
      jest.advanceTimersByTime(500);
      expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(SearchUsers));
    } finally {
      jest.useRealTimers();
    }
  });

  it('should compute contributorNames as comma-separated full names', () => {
    setup();
    component.selectedUsers.set([users[0], users[1]]);
    expect(component.contributorNames()).toBe('User One, User Two');
    component.selectedUsers.set([]);
    expect(component.contributorNames()).toBe('');
  });

  it.each([
    ['Search state', AddDialogState.Search, components, 'common.buttons.next'],
    ['Details with multiple components', AddDialogState.Details, components, 'common.buttons.next'],
    ['Details with single component', AddDialogState.Details, singleComponent, 'common.buttons.done'],
    ['Components state', AddDialogState.Components, components, 'common.buttons.done'],
  ])('buttonLabel: %s → "%s"', (_, state, dialogComponents, expected) => {
    setup({ dialogData: { components: dialogComponents } });
    component.currentState.set(state);
    expect(component.buttonLabel()).toBe(expected);
  });
});
