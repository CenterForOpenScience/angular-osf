import { MockComponents, MockProviders } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPaginatorComponent, LoadingSpinnerComponent, SearchInputComponent } from '@shared/components';
import { AddContributorItemComponent } from '@shared/components/contributors/add-contributor-item/add-contributor-item.component';
import { AddContributorType, AddDialogState } from '@shared/enums/contributors';
import { ContributorAddModel } from '@shared/models';
import { ContributorsSelectors } from '@shared/stores';

import { AddContributorDialogComponent } from './add-contributor-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('AddContributorDialogComponent', () => {
  let component: AddContributorDialogComponent;
  let fixture: ComponentFixture<AddContributorDialogComponent>;
  let dialogRef: DynamicDialogRef;
  let closeSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddContributorDialogComponent,
        OSFTestingModule,
        ...MockComponents(
          SearchInputComponent,
          LoadingSpinnerComponent,
          CustomPaginatorComponent,
          AddContributorItemComponent
        ),
      ],
      providers: [
        provideMockStore({
          signals: [
            { selector: ContributorsSelectors.getUsers, value: signal([]) },
            { selector: ContributorsSelectors.isUsersLoading, value: false },
            { selector: ContributorsSelectors.getUsersTotalCount, value: 0 },
          ],
        }),
        MockProviders(DynamicDialogRef, DynamicDialogConfig),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddContributorDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);
    closeSpy = jest.spyOn(dialogRef, 'close');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have search control initialized', () => {
    expect(component['searchControl']).toBeDefined();
    expect(component['searchControl'].value).toBe('');
  });

  it('should have config injected', () => {
    expect(component['config']).toBeDefined();
  });

  it('should have dialogRef injected', () => {
    expect(component['dialogRef']).toBeDefined();
  });

  it('should check isSearchState getter', () => {
    expect(component['isSearchState']()).toBe(true);

    component['currentState'].set(AddDialogState.Details);
    expect(component['isSearchState']()).toBe(false);
  });

  it('should add contributor and close dialog when in details state', () => {
    const mockUsers: ContributorAddModel[] = [
      { id: '1', fullName: 'Test User', isBibliographic: true, permission: 'read' },
    ];

    component['selectedUsers'].set(mockUsers);
    component['currentState'].set(AddDialogState.Details);

    component['addContributor']();

    expect(closeSpy).toHaveBeenCalledWith({
      data: mockUsers,
      type: AddContributorType.Registered,
    });
  });

  it('should add unregistered contributor and close dialog', () => {
    component['addUnregistered']();

    expect(closeSpy).toHaveBeenCalledWith({
      data: [],
      type: AddContributorType.Unregistered,
    });
  });

  it('should handle search state transitions', () => {
    expect(component['isSearchState']()).toBe(true);
    expect(component['isInitialState']()).toBe(true);

    component['currentState'].set(AddDialogState.Details);
    expect(component['isSearchState']()).toBe(false);
  });
});
