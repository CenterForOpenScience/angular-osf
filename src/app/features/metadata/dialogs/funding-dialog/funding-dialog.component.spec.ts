import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

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

import { Funder, RorFunderOption } from '../../models';
import { GetFundersList, MetadataSelectors } from '../../store';

import { FundingDialogComponent } from './funding-dialog.component';

interface SetupOverrides extends BaseSetupOverrides {
  configFunders?: Funder[];
}

describe('FundingDialogComponent', () => {
  let component: FundingDialogComponent;
  let fixture: ComponentFixture<FundingDialogComponent>;
  let dialogRef: DynamicDialogRef;
  let store: Store;

  const mockFundersList: RorFunderOption[] = [
    { id: 'https://ror.org/111', name: 'Open Science Foundation' },
    { id: 'https://ror.org/222', name: 'National Science Fund' },
  ];

  const defaultSignals: SignalOverride[] = [
    { selector: MetadataSelectors.getFundersList, value: mockFundersList },
    { selector: MetadataSelectors.getFundersLoading, value: false },
  ];

  function setup(overrides: SetupOverrides = {}) {
    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

    TestBed.configureTestingModule({
      imports: [FundingDialogComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, { data: { funders: overrides.configFunders ?? [] } }),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(FundingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should initialize with one empty entry when config has no funders', () => {
    setup();

    expect(component.fundingEntries.length).toBe(1);
    expect(component.fundingEntries.at(0).get('funderName')?.value).toBeNull();
    expect(component.fundingEntries.at(0).get('funderIdentifierType')?.value).toBe('DOI');
  });

  it('should initialize entries from config funders', () => {
    const configFunders: Funder[] = [
      {
        funderName: 'Configured Funder',
        funderIdentifier: '10.123/abc',
        funderIdentifierType: 'DOI',
        awardTitle: 'Configured Award',
        awardUri: 'https://example.org/award',
        awardNumber: 'A-100',
      },
    ];

    setup({ configFunders });

    expect(component.fundingEntries.length).toBe(1);
    expect(component.fundingEntries.at(0).value).toEqual(configFunders[0]);
  });

  it('should return loading filter message when funders are loading', () => {
    setup({
      selectorOverrides: [{ selector: MetadataSelectors.getFundersLoading, value: true }],
    });

    expect(component.filterMessage()).toBe('project.metadata.funding.dialog.loadingFunders');
  });

  it('should dispatch GetFundersList after debounced search', () => {
    vi.useFakeTimers();
    setup();
    (store.dispatch as Mock).mockClear();

    component.onFunderSearch('open');
    vi.advanceTimersByTime(300);

    expect(store.dispatch).toHaveBeenCalledWith(new GetFundersList('open'));
  });

  it('should not dispatch duplicate consecutive search terms', () => {
    vi.useFakeTimers();
    setup();
    (store.dispatch as Mock).mockClear();

    component.onFunderSearch('same');
    vi.advanceTimersByTime(300);
    component.onFunderSearch('same');
    vi.advanceTimersByTime(300);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(new GetFundersList('same'));
  });

  it('should return selected current entry in options when missing in list', () => {
    setup({
      selectorOverrides: [{ selector: MetadataSelectors.getFundersList, value: [] }],
    });
    component.fundingEntries.at(0).patchValue({
      funderName: 'Manual Funder',
      funderIdentifier: 'manual-id',
    });

    const options = component.getOptionsForIndex(0);

    expect(options).toEqual([{ id: 'manual-id', name: 'Manual Funder' }]);
  });

  it('should patch selected funder data when a funder is selected', () => {
    setup();

    component.onFunderSelected('National Science Fund', 0);

    expect(component.fundingEntries.at(0).get('funderName')?.value).toBe('National Science Fund');
    expect(component.fundingEntries.at(0).get('funderIdentifier')?.value).toBe('https://ror.org/222');
    expect(component.fundingEntries.at(0).get('funderIdentifierType')?.value).toBe('ROR');
  });

  it('should remove entry when more than one funding entry exists', () => {
    setup();
    component.addFundingEntry();

    component.removeFundingEntry(1);

    expect(component.fundingEntries.length).toBe(1);
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close with empty result when removing the last entry', () => {
    setup();

    component.removeFundingEntry(0);

    expect(dialogRef.close).toHaveBeenCalledWith({ fundingEntries: [] });
  });

  it('should close with funding data on save when form is valid', () => {
    setup();
    component.fundingEntries.at(0).patchValue({
      funderName: 'Open Science Foundation',
      funderIdentifier: 'https://ror.org/111',
      funderIdentifierType: 'ROR',
      awardTitle: '',
      awardUri: '',
      awardNumber: '',
    });

    component.save();

    expect(dialogRef.close).toHaveBeenCalledWith({
      fundingEntries: [
        {
          funderName: 'Open Science Foundation',
          funderIdentifier: 'https://ror.org/111',
          funderIdentifierType: 'ROR',
          awardTitle: '',
          awardUri: '',
          awardNumber: '',
        },
      ],
    });
  });

  it('should not close on save when form is invalid', () => {
    setup();

    component.save();

    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close dialog on cancel', () => {
    setup();

    component.cancel();

    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});
