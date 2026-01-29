import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';

import { signal } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AddContributorType } from '@osf/shared/enums/contributors/add-contributor-type.enum';
import { AddDialogState } from '@osf/shared/enums/contributors/add-dialog-state.enum';
import { AddContributorItemComponent } from '@shared/components/contributors/add-contributor-item/add-contributor-item.component';
import { ContributorsSelectors } from '@shared/stores/contributors';

import { ComponentsSelectionListComponent } from '../../components-selection-list/components-selection-list.component';
import { CustomPaginatorComponent } from '../../custom-paginator/custom-paginator.component';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { SearchInputComponent } from '../../search-input/search-input.component';

import { AddContributorDialogComponent } from './add-contributor-dialog.component';

import {
  MOCK_COMPONENT_CHECKBOX_ITEM,
  MOCK_COMPONENT_CHECKBOX_ITEM_CURRENT,
  MOCK_CONTRIBUTOR_ADD,
  MOCK_CONTRIBUTOR_ADD_DISABLED,
} from '@testing/mocks/contributors.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('AddContributorDialogComponent', () => {
  let component: AddContributorDialogComponent;
  let fixture: ComponentFixture<AddContributorDialogComponent>;
  let dialogRef: jest.Mocked<DynamicDialogRef>;
  let dialogConfig: DynamicDialogConfig;
  let store: Store;

  beforeEach(async () => {
    dialogRef = {
      close: jest.fn(),
    } as any;

    dialogConfig = {
      data: {},
    } as DynamicDialogConfig;

    await TestBed.configureTestingModule({
      imports: [
        AddContributorDialogComponent,
        OSFTestingModule,
        ...MockComponents(
          SearchInputComponent,
          LoadingSpinnerComponent,
          CustomPaginatorComponent,
          AddContributorItemComponent,
          ComponentsSelectionListComponent
        ),
      ],
      providers: [
        provideMockStore({
          signals: [
            { selector: ContributorsSelectors.getUsers, value: signal([]) },
            { selector: ContributorsSelectors.isUsersLoading, value: false },
            { selector: ContributorsSelectors.getUsersTotalCount, value: 0 },
            { selector: ContributorsSelectors.getUsersNextLink, value: signal(null) },
            { selector: ContributorsSelectors.getUsersPreviousLink, value: signal(null) },
          ],
        }),
        { provide: DynamicDialogRef, useValue: dialogRef },
        { provide: DynamicDialogConfig, useValue: dialogConfig },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(AddContributorDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentState()).toBe(AddDialogState.Search);
    expect(component.isInitialState()).toBe(true);
    expect(component.selectedUsers()).toEqual([]);
  });

  it('should initialize dialog data from config', () => {
    const mockComponents = [MOCK_COMPONENT_CHECKBOX_ITEM];
    dialogConfig.data = {
      components: mockComponents,
      resourceName: 'Test Resource',
      parentResourceName: 'Parent Resource',
      allowAddingContributorsFromParentProject: true,
    };

    fixture = TestBed.createComponent(AddContributorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.components()).toEqual(mockComponents);
    expect(component.resourceName()).toBe('Test Resource');
  });

  it('should compute contributorNames correctly', () => {
    component.selectedUsers.set([MOCK_CONTRIBUTOR_ADD, MOCK_CONTRIBUTOR_ADD_DISABLED]);
    expect(component.contributorNames()).toBe('John Doe, Jane Smith');
  });

  it('should compute state flags correctly', () => {
    component.currentState.set(AddDialogState.Search);
    expect(component.isSearchState()).toBe(true);
    expect(component.isDetailsState()).toBe(false);

    component.currentState.set(AddDialogState.Details);
    expect(component.isDetailsState()).toBe(true);
    expect(component.isSearchState()).toBe(false);
  });

  it('should compute hasComponents correctly', () => {
    component.components.set([MOCK_COMPONENT_CHECKBOX_ITEM, MOCK_COMPONENT_CHECKBOX_ITEM_CURRENT]);
    expect(component.hasComponents()).toBe(true);

    component.components.set([MOCK_COMPONENT_CHECKBOX_ITEM]);
    expect(component.hasComponents()).toBe(false);
  });

  it('should compute buttonLabel based on state and components', () => {
    component.currentState.set(AddDialogState.Search);
    expect(component.buttonLabel()).toBe('common.buttons.next');

    component.currentState.set(AddDialogState.Details);
    component.components.set([]);
    expect(component.buttonLabel()).toBe('common.buttons.done');

    component.components.set([MOCK_COMPONENT_CHECKBOX_ITEM, MOCK_COMPONENT_CHECKBOX_ITEM_CURRENT]);
    expect(component.buttonLabel()).toBe('common.buttons.next');

    component.currentState.set(AddDialogState.Components);
    expect(component.buttonLabel()).toBe('common.buttons.done');
  });

  it('should transition states and close dialog appropriately', () => {
    component.currentState.set(AddDialogState.Search);
    component.addContributor();
    expect(component.currentState()).toBe(AddDialogState.Details);

    component.currentState.set(AddDialogState.Details);
    component.components.set([MOCK_COMPONENT_CHECKBOX_ITEM, MOCK_COMPONENT_CHECKBOX_ITEM_CURRENT]);
    component.addContributor();
    expect(component.currentState()).toBe(AddDialogState.Components);

    component.currentState.set(AddDialogState.Details);
    component.components.set([]);
    component.selectedUsers.set([MOCK_CONTRIBUTOR_ADD]);
    component.addContributor();
    expect(dialogRef.close).toHaveBeenCalledWith({
      data: [MOCK_CONTRIBUTOR_ADD],
      type: AddContributorType.Registered,
      childNodeIds: undefined,
    });

    component.currentState.set(AddDialogState.Components);
    component.components.set([{ ...MOCK_COMPONENT_CHECKBOX_ITEM, checked: true }]);
    component.addContributor();
    expect(dialogRef.close).toHaveBeenCalledTimes(2);
  });

  it('should close dialog with correct data for different actions', () => {
    component.selectedUsers.set([MOCK_CONTRIBUTOR_ADD]);

    component.addSourceProjectContributors();
    expect(dialogRef.close).toHaveBeenCalledWith({
      data: [MOCK_CONTRIBUTOR_ADD],
      type: AddContributorType.ParentProject,
      childNodeIds: undefined,
    });

    component.addUnregistered();
    expect(dialogRef.close).toHaveBeenCalledWith({
      data: [],
      type: AddContributorType.Unregistered,
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
      if (selector === ContributorsSelectors.getUsersNextLink) {
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
    fixture.detectChanges();
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
    fixture.detectChanges();
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.searchControl.setValue('');
    tick(500);
    expect(dispatchSpy).not.toHaveBeenCalled();

    component.searchControl.setValue('   ');
    tick(500);
    expect(dispatchSpy).not.toHaveBeenCalled();
  }));

  it('should reset pagination on search', fakeAsync(() => {
    fixture.detectChanges();
    component.currentPage.set(3);
    component.first.set(20);

    component.searchControl.setValue('test');
    tick(500);

    expect(component.currentPage()).toBe(1);
    expect(component.first()).toBe(0);
  }));

  it('should update selectedUsers from checked users', () => {
    const checkedUsers = [MOCK_CONTRIBUTOR_ADD];
    const usersSignal = signal(checkedUsers);

    Object.defineProperty(component, 'users', {
      get: () => usersSignal,
      configurable: true,
    });

    fixture.detectChanges();
    usersSignal.set(checkedUsers);
    fixture.detectChanges();

    expect(component.selectedUsers().length).toBeGreaterThan(0);
  });

  it('should filter disabled users and include childNodeIds', () => {
    component.selectedUsers.set([MOCK_CONTRIBUTOR_ADD, MOCK_CONTRIBUTOR_ADD_DISABLED]);
    component.components.set([]);
    component['closeDialogWithData']();

    expect(dialogRef.close).toHaveBeenCalledWith({
      data: [MOCK_CONTRIBUTOR_ADD],
      type: AddContributorType.Registered,
      childNodeIds: undefined,
    });

    component.components.set([{ ...MOCK_COMPONENT_CHECKBOX_ITEM, checked: true }]);
    component['closeDialogWithData'](AddContributorType.ParentProject);

    expect(dialogRef.close).toHaveBeenCalledWith({
      data: [MOCK_CONTRIBUTOR_ADD],
      type: AddContributorType.ParentProject,
      childNodeIds: [MOCK_COMPONENT_CHECKBOX_ITEM.id],
    });
  });

  it('should clear users on destroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalled();
  });
});
