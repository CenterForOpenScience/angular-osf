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
        MockProviders(DynamicDialogRef, DestroyRef),
        MockProvider(DynamicDialogConfig, { data: null }),
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

  it('should not update funding entry when funder is not found', () => {
    const entry = component.fundingEntries.at(0);
    const initialValues = {
      funderName: entry.get('funderName')?.value,
      funderIdentifier: entry.get('funderIdentifier')?.value,
      funderIdentifierType: entry.get('funderIdentifierType')?.value,
    };

    component.onFunderSelected('Non-existent Funder', 0);

    expect(entry.get('funderName')?.value).toBe(initialValues.funderName);
    expect(entry.get('funderIdentifier')?.value).toBe(initialValues.funderIdentifier);
    expect(entry.get('funderIdentifierType')?.value).toBe(initialValues.funderIdentifierType);
  });

  it('should handle empty funders list', () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === ProjectMetadataSelectors.getFundersList) return () => [];
      if (selector === ProjectMetadataSelectors.getFundersLoading) return () => false;
      return () => null;
    });

    const entry = component.fundingEntries.at(0);
    const initialValues = {
      funderName: entry.get('funderName')?.value,
      funderIdentifier: entry.get('funderIdentifier')?.value,
      funderIdentifierType: entry.get('funderIdentifierType')?.value,
    };

    component.onFunderSelected('Any Funder', 0);

    expect(entry.get('funderName')?.value).toBe(initialValues.funderName);
    expect(entry.get('funderIdentifier')?.value).toBe(initialValues.funderIdentifier);
    expect(entry.get('funderIdentifierType')?.value).toBe(initialValues.funderIdentifierType);
  });

  it('should handle null funders list', () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === ProjectMetadataSelectors.getFundersList) return () => null;
      if (selector === ProjectMetadataSelectors.getFundersLoading) return () => false;
      return () => null;
    });

    const entry = component.fundingEntries.at(0);
    const initialValues = {
      funderName: entry.get('funderName')?.value,
      funderIdentifier: entry.get('funderIdentifier')?.value,
      funderIdentifierType: entry.get('funderIdentifierType')?.value,
    };

    component.onFunderSelected('Any Funder', 0);

    expect(entry.get('funderName')?.value).toBe(initialValues.funderName);
    expect(entry.get('funderIdentifier')?.value).toBe(initialValues.funderIdentifier);
    expect(entry.get('funderIdentifierType')?.value).toBe(initialValues.funderIdentifierType);
  });

  it('should remove funding entry when more than one exists', () => {
    component.addFundingEntry();
    expect(component.fundingEntries.length).toBe(2);

    component.removeFundingEntry(0);
    expect(component.fundingEntries.length).toBe(1);
  });

  it('should not remove funding entry when only one exists', () => {
    expect(component.fundingEntries.length).toBe(1);

    component.removeFundingEntry(0);
    expect(component.fundingEntries.length).toBe(1);
  });

  it('should not remove funding entry when index is out of bounds', () => {
    component.addFundingEntry();
    const initialLength = component.fundingEntries.length;

    component.removeFundingEntry(999);
    expect(component.fundingEntries.length).toBe(initialLength);
  });

  it('should save when form is valid', () => {
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

    const entry = component.fundingEntries.at(0);
    entry.patchValue({
      funderName: '',
      awardTitle: '',
    });

    component.save();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should filter out empty entries when saving', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    component.addFundingEntry();
    const firstEntry = component.fundingEntries.at(0);
    const secondEntry = component.fundingEntries.at(1);

    firstEntry.patchValue({
      funderName: 'Test Funder',
      awardTitle: 'Test Award',
    });

    secondEntry.patchValue({
      funderName: 'Test Funder 2',
      awardTitle: 'Test Award 2',
      awardUri: '',
      awardNumber: '',
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
        {
          funderName: 'Test Funder 2',
          funderIdentifier: '',
          funderIdentifierType: 'DOI',
          awardTitle: 'Test Award 2',
          awardUri: '',
          awardNumber: '',
        },
      ],
    });
  });

  it('should include entries with only funderName', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    const entry = component.fundingEntries.at(0);
    entry.patchValue({
      funderName: 'Test Funder',
      awardTitle: 'Test Award',
      awardUri: '',
      awardNumber: '',
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

  it('should include entries with only awardTitle', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    const entry = component.fundingEntries.at(0);
    entry.patchValue({
      funderName: 'Test Funder',
      awardTitle: 'Test Award',
      awardUri: '',
      awardNumber: '',
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

  it('should include entries with only awardUri', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    const entry = component.fundingEntries.at(0);
    entry.patchValue({
      funderName: 'Test Funder',
      awardTitle: 'Test Award',
      awardUri: 'https://test.com',
      awardNumber: '',
    });

    component.save();

    expect(closeSpy).toHaveBeenCalledWith({
      fundingEntries: [
        {
          funderName: 'Test Funder',
          funderIdentifier: '',
          funderIdentifierType: 'DOI',
          awardTitle: 'Test Award',
          awardUri: 'https://test.com',
          awardNumber: '',
        },
      ],
    });
  });

  it('should include entries with only awardNumber', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    const entry = component.fundingEntries.at(0);
    entry.patchValue({
      funderName: 'Test Funder',
      awardTitle: 'Test Award',
      awardUri: '',
      awardNumber: 'AWARD-123',
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
          awardNumber: 'AWARD-123',
        },
      ],
    });
  });

  it('should filter out completely empty entries', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    const entry = component.fundingEntries.at(0);
    entry.patchValue({
      funderName: '',
      awardTitle: '',
      awardUri: '',
      awardNumber: '',
    });

    component.save();
    expect(closeSpy).not.toHaveBeenCalled();

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

  it('should create entry with supplement data when provided', () => {
    const supplement = {
      funderName: 'Test Funder',
      funderIdentifier: 'test-id',
      funderIdentifierType: 'Crossref Funder ID',
      title: 'Test Award',
      url: 'https://test.com',
      awardNumber: 'AWARD-123',
    };

    component.addFundingEntry(supplement);

    const entry = component.fundingEntries.at(component.fundingEntries.length - 1);
    expect(entry.get('funderName')?.value).toBe('Test Funder');
    expect(entry.get('funderIdentifier')?.value).toBe('test-id');
    expect(entry.get('funderIdentifierType')?.value).toBe('Crossref Funder ID');
    expect(entry.get('awardTitle')?.value).toBe('Test Award');
    expect(entry.get('awardUri')?.value).toBe('https://test.com');
    expect(entry.get('awardNumber')?.value).toBe('AWARD-123');
  });

  it('should create entry with supplement data using awardTitle fallback', () => {
    const supplement = {
      funderName: 'Test Funder',
      awardTitle: 'Test Award Title',
      url: 'https://test.com',
    };

    component.addFundingEntry(supplement);

    const entry = component.fundingEntries.at(component.fundingEntries.length - 1);
    expect(entry.get('awardTitle')?.value).toBe('Test Award Title');
  });

  it('should create entry with supplement data using awardUri fallback', () => {
    const supplement = {
      funderName: 'Test Funder',
      awardUri: 'https://award.com',
    };

    component.addFundingEntry(supplement);

    const entry = component.fundingEntries.at(component.fundingEntries.length - 1);
    expect(entry.get('awardUri')?.value).toBe('https://award.com');
  });

  it('should create entry with default values when no supplement provided', () => {
    const initialLength = component.fundingEntries.length;
    component.addFundingEntry();

    const entry = component.fundingEntries.at(initialLength);
    expect(entry.get('funderName')?.value).toBe('');
    expect(entry.get('funderIdentifier')?.value).toBe('');
    expect(entry.get('funderIdentifierType')?.value).toBe('DOI');
    expect(entry.get('awardTitle')?.value).toBe('');
    expect(entry.get('awardUri')?.value).toBe('');
    expect(entry.get('awardNumber')?.value).toBe('');
  });

  it('should emit search query to searchSubject', () => {
    const searchSpy = jest.spyOn(component['searchSubject'], 'next');

    component.onFunderSearch('test search');

    expect(searchSpy).toHaveBeenCalledWith('test search');
  });

  it('should handle empty search term', () => {
    const searchSpy = jest.spyOn(component['searchSubject'], 'next');

    component.onFunderSearch('');

    expect(searchSpy).toHaveBeenCalledWith('');
  });

  it('should handle multiple search calls', () => {
    const searchSpy = jest.spyOn(component['searchSubject'], 'next');

    component.onFunderSearch('first');
    component.onFunderSearch('second');
    component.onFunderSearch('third');

    expect(searchSpy).toHaveBeenCalledTimes(3);
    expect(searchSpy).toHaveBeenNthCalledWith(1, 'first');
    expect(searchSpy).toHaveBeenNthCalledWith(2, 'second');
    expect(searchSpy).toHaveBeenNthCalledWith(3, 'third');
  });
});
