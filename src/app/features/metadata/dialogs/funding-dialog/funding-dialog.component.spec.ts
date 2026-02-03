import { Store } from '@ngxs/store';

import { MockProvider, MockProviders } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { DestroyRef, signal } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RorFunderOption } from '../../models/ror.model';
import { GetFundersList, MetadataSelectors } from '../../store';

import { FundingDialogComponent } from './funding-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

const MOCK_ROR_FUNDERS: RorFunderOption[] = [{ id: 'https://ror.org/0test', name: 'Test Funder' }];

describe('FundingDialogComponent', () => {
  let component: FundingDialogComponent;
  let fixture: ComponentFixture<FundingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundingDialogComponent, OSFTestingModule],
      providers: [
        MockProviders(DynamicDialogRef, DestroyRef),
        MockProvider(DynamicDialogConfig, { data: { funders: [] } }),
        provideMockStore({
          signals: [
            { selector: MetadataSelectors.getFundersList, value: MOCK_ROR_FUNDERS },
            { selector: MetadataSelectors.getFundersLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FundingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not remove last funding entry and close dialog with empty result', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');
    expect(component.fundingEntries.length).toBe(1);

    component.removeFundingEntry(0);

    expect(component.fundingEntries.length).toBe(1);
    expect(closeSpy).toHaveBeenCalledWith({ fundingEntries: [] });
  });

  it('should save valid form data', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');

    const entry = component.fundingEntries.at(0);
    entry.patchValue({
      funderName: 'Test Funder',
      awardTitle: 'Test Award',
      awardUri: 'https://www.nsf.gov/awardsearch/showAward?AWD_ID=1234567',
    });

    fixture.detectChanges();

    component.save();

    expect(closeSpy).toHaveBeenCalledWith({
      fundingEntries: [
        {
          funderName: 'Test Funder',
          funderIdentifier: '',
          funderIdentifierType: 'DOI',
          awardTitle: 'Test Award',
          awardUri: 'https://www.nsf.gov/awardsearch/showAward?AWD_ID=1234567',
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
    expect(awardTitleControl?.hasError('required')).toBe(false);

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

  it('should update funding entry when funder is selected from ROR list', () => {
    const entry = component.fundingEntries.at(0);

    component.onFunderSelected('Test Funder', 0);

    expect(entry.get('funderName')?.value).toBe('Test Funder');
    expect(entry.get('funderIdentifier')?.value).toBe('https://ror.org/0test');
    expect(entry.get('funderIdentifierType')?.value).toBe('ROR');
  });

  it('should remove funding entry when more than one exists', () => {
    component.addFundingEntry();
    expect(component.fundingEntries.length).toBe(2);

    component.removeFundingEntry(0);
    expect(component.fundingEntries.length).toBe(1);
  });

  it('should not remove funding entry when index is out of bounds', () => {
    component.addFundingEntry();
    const initialLength = component.fundingEntries.length;

    component.removeFundingEntry(999);
    expect(component.fundingEntries.length).toBe(initialLength);
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
    expect(entry.get('funderName')?.value).toBe(null);
    expect(entry.get('funderIdentifier')?.value).toBe('');
    expect(entry.get('funderIdentifierType')?.value).toBe('DOI');
    expect(entry.get('awardTitle')?.value).toBe('');
    expect(entry.get('awardUri')?.value).toBe('');
    expect(entry.get('awardNumber')?.value).toBe('');
  });

  it('should dispatch getFundersList after debounce when searching', fakeAsync(() => {
    const store = TestBed.inject(Store);
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.onFunderSearch('query');
    expect(dispatchSpy).not.toHaveBeenCalled();
    tick(300);
    expect(dispatchSpy).toHaveBeenCalledWith(new GetFundersList('query'));
  }));

  it('should pre-populate entries from config funders on init', () => {
    TestBed.resetTestingModule();
    const configFunders = [
      {
        funderName: 'NSF',
        funderIdentifier: 'https://ror.org/nsf',
        funderIdentifierType: 'ROR',
        awardTitle: 'Grant A',
        awardUri: 'https://example.com/a',
        awardNumber: '123',
      },
    ];
    TestBed.configureTestingModule({
      imports: [FundingDialogComponent, OSFTestingModule],
      providers: [
        MockProviders(DynamicDialogRef, DestroyRef),
        MockProvider(DynamicDialogConfig, { data: { funders: configFunders } }),
        provideMockStore({
          signals: [
            { selector: MetadataSelectors.getFundersList, value: [] },
            { selector: MetadataSelectors.getFundersLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();
    const f = TestBed.createComponent(FundingDialogComponent);
    f.detectChanges();
    const c = f.componentInstance;
    expect(c.fundingEntries.length).toBe(1);
    const entry = c.fundingEntries.at(0);
    expect(entry.get('funderName')?.value).toBe('NSF');
    expect(entry.get('funderIdentifier')?.value).toBe('https://ror.org/nsf');
    expect(entry.get('funderIdentifierType')?.value).toBe('ROR');
    expect(entry.get('awardTitle')?.value).toBe('Grant A');
    expect(entry.get('awardUri')?.value).toBe('https://example.com/a');
    expect(entry.get('awardNumber')?.value).toBe('123');
  });

  it('getOptionsForIndex returns custom option plus list when entry name is not in list', () => {
    const entry = component.fundingEntries.at(0);
    entry.patchValue({ funderName: 'Custom Funder', funderIdentifier: 'custom-id' });
    const options = component.getOptionsForIndex(0);
    expect(options).toHaveLength(2);
    expect(options[0]).toEqual({ id: 'custom-id', name: 'Custom Funder' });
    expect(options[1]).toEqual(MOCK_ROR_FUNDERS[0]);
  });

  it('getOptionsForIndex returns list when entry has no name', () => {
    const options = component.getOptionsForIndex(0);
    expect(options).toEqual(MOCK_ROR_FUNDERS);
  });

  it('filterMessage returns loading key when funders loading', () => {
    TestBed.resetTestingModule();
    const loadingSignal = signal(true);
    TestBed.configureTestingModule({
      imports: [FundingDialogComponent, OSFTestingModule],
      providers: [
        MockProviders(DynamicDialogRef, DestroyRef),
        MockProvider(DynamicDialogConfig, { data: { funders: [] } }),
        provideMockStore({
          signals: [
            { selector: MetadataSelectors.getFundersList, value: [] },
            { selector: MetadataSelectors.getFundersLoading, value: loadingSignal },
          ],
        }),
      ],
    }).compileComponents();
    const f = TestBed.createComponent(FundingDialogComponent);
    f.detectChanges();
    expect(f.componentInstance.filterMessage()).toBe('project.metadata.funding.dialog.loadingFunders');
    loadingSignal.set(false);
    expect(f.componentInstance.filterMessage()).toBe('project.metadata.funding.dialog.noFundersFound');
  });

  it('save returns only entries with at least one of funderName, awardTitle, awardUri, awardNumber', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');
    component.addFundingEntry();
    component.fundingEntries.at(0).patchValue({ funderName: 'Funder A', awardTitle: 'Award A' });
    component.fundingEntries.at(1).patchValue({ funderName: 'Funder B', awardTitle: 'Award B' });
    fixture.detectChanges();
    component.save();
    expect(closeSpy).toHaveBeenCalledWith({
      fundingEntries: [
        expect.objectContaining({ funderName: 'Funder A', awardTitle: 'Award A' }),
        expect.objectContaining({ funderName: 'Funder B', awardTitle: 'Award B' }),
      ],
    });
  });

  it('should not save when awardUri is invalid', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    const closeSpy = jest.spyOn(dialogRef, 'close');
    const entry = component.fundingEntries.at(0);
    entry.patchValue({
      funderName: 'Test Funder',
      awardUri: 'not-a-valid-url',
    });
    fixture.detectChanges();
    component.save();
    expect(closeSpy).not.toHaveBeenCalled();
  });
});
