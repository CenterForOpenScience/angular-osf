import { Store } from '@ngxs/store';

import { MockProvider, MockProviders } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContributorType, AddDialogState } from '@shared/enums/contributors';
import { MOCK_STORE, TranslateServiceMock } from '@shared/mocks';
import { ContributorAddModel } from '@shared/models';
import { ContributorsSelectors } from '@shared/stores';

import { AddContributorDialogComponent } from './add-contributor-dialog.component';

describe('AddContributorDialogComponent', () => {
  let component: AddContributorDialogComponent;
  let fixture: ComponentFixture<AddContributorDialogComponent>;
  let dialogRef: DynamicDialogRef;
  let closeSpy: jest.SpyInstance;

  beforeEach(async () => {
    MOCK_STORE.selectSignal.mockImplementation((selector) => {
      if (selector === ContributorsSelectors.getUsers) return () => signal([]);
      if (selector === ContributorsSelectors.isUsersLoading) return () => signal(false);
      if (selector === ContributorsSelectors.getUsersTotalCount) return () => signal(0);
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [AddContributorDialogComponent],
      providers: [
        MockProviders(DynamicDialogRef, DynamicDialogConfig),
        TranslateServiceMock,
        MockProvider(Store, MOCK_STORE),
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
    expect(component['isSearchState']).toBe(true);

    component['currentState'].set(AddDialogState.Details);
    expect(component['isSearchState']).toBe(false);
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
    expect(component['isSearchState']).toBe(true);
    expect(component['isInitialState']()).toBe(true);

    component['currentState'].set(AddDialogState.Details);
    expect(component['isSearchState']).toBe(false);
  });
});
