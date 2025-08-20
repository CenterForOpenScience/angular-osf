import { Store } from '@ngxs/store';

import { MockProvider, MockProviders } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { DestroyRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMetadataSelectors } from '@osf/features/project/metadata/store';
import { MOCK_FUNDERS, MOCK_STORE, TranslateServiceMock } from '@shared/mocks';

import { FundingDialogComponent } from './funding-dialog.component';

describe('FundingDialogComponent', () => {
  let component: FundingDialogComponent;
  let fixture: ComponentFixture<FundingDialogComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === ProjectMetadataSelectors.getFundersList) return () => MOCK_FUNDERS;
      if (selector === ProjectMetadataSelectors.getFundersLoading) return () => false;
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [FundingDialogComponent],
      providers: [
        TranslateServiceMock,
        MockProviders(DynamicDialogRef, DynamicDialogConfig, DestroyRef),
        MockProvider(Store, MOCK_STORE),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FundingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add funding entry', () => {
    const initialLength = component.fundingEntries.length;
    component.addFundingEntry();

    expect(component.fundingEntries.length).toBe(initialLength + 1);
    const entry = component.fundingEntries.at(component.fundingEntries.length - 1);
    expect(entry.get('funderName')?.value).toBe('');
    expect(entry.get('awardTitle')?.value).toBe('');
  });

  it('should not remove funding entry when only one exists', () => {
    expect(component.fundingEntries.length).toBe(1);

    component.removeFundingEntry(0);

    expect(component.fundingEntries.length).toBe(1);
  });

  it('should save valid form data', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    const entry = component.fundingEntries.at(0);
    entry.patchValue({
      funderName: 'Test Funder',
      awardTitle: 'Test Award',
    });

    component.save();

    expect(closeSpy).toHaveBeenCalledWith({
      fundingEntries: [
        {
          funderName: 'Test Funder',
          funderIdentifier: '',
          funderIdentifierType: 'DOI',
          awardTitle: 'Test Award',
          awardUri: '',
          awardNumber: '',
        },
      ],
    });
  });

  it('should not save when form is invalid', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    component.addFundingEntry();
    const entry = component.fundingEntries.at(0);
    entry.patchValue({
      funderName: '',
      awardTitle: '',
    });

    component.save();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should cancel dialog', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    component.cancel();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    component.addFundingEntry();
    const entry = component.fundingEntries.at(0);

    const funderNameControl = entry.get('funderName');
    const awardTitleControl = entry.get('awardTitle');

    expect(funderNameControl?.hasError('required')).toBe(true);
    expect(awardTitleControl?.hasError('required')).toBe(true);

    funderNameControl?.setValue('Test Funder');
    awardTitleControl?.setValue('Test Award');

    expect(funderNameControl?.hasError('required')).toBe(false);
    expect(awardTitleControl?.hasError('required')).toBe(false);
  });
});
