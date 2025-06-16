import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { SelectChangeEvent } from 'primeng/select';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  PreprintsResourcesFiltersSelectors,
  SetLicense,
} from '@osf/features/preprints/store/preprints-resources-filters';
import {
  GetAllOptions,
  PreprintsResourcesFiltersOptionsSelectors,
} from '@osf/features/preprints/store/preprints-resources-filters-options';
import { LicenseFilter } from '@osf/shared/models';

import { PreprintsLicenseFilterComponent } from './preprints-license-filter.component';

describe('LicenseFilterComponent', () => {
  let component: PreprintsLicenseFilterComponent;
  let fixture: ComponentFixture<PreprintsLicenseFilterComponent>;

  const mockStore = {
    selectSignal: jest.fn(),
    dispatch: jest.fn(),
  };

  const mockLicenses: LicenseFilter[] = [
    { id: '1', label: 'MIT License', count: 10 },
    { id: '2', label: 'Apache License 2.0', count: 5 },
    { id: '3', label: 'GNU GPL v3', count: 3 },
  ];

  beforeEach(async () => {
    mockStore.selectSignal.mockImplementation((selector) => {
      if (selector === PreprintsResourcesFiltersOptionsSelectors.getLicenses) {
        return signal(mockLicenses);
      }
      if (selector === PreprintsResourcesFiltersSelectors.getLicense) {
        return signal({ label: '', value: '' });
      }
      return signal(null);
    });

    await TestBed.configureTestingModule({
      imports: [PreprintsLicenseFilterComponent],
      providers: [MockProvider(Store, mockStore)],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsLicenseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty input text', () => {
    expect(component['inputText']()).toBeNull();
  });

  it('should show all licenses when no search text is entered', () => {
    const options = component['licensesOptions']();
    expect(options.length).toBe(3);
    expect(options[0].labelCount).toBe('MIT License (10)');
    expect(options[1].labelCount).toBe('Apache License 2.0 (5)');
    expect(options[2].labelCount).toBe('GNU GPL v3 (3)');
  });

  it('should filter licenses based on search text', () => {
    component['inputText'].set('MIT');
    const options = component['licensesOptions']();
    expect(options.length).toBe(1);
    expect(options[0].labelCount).toBe('MIT License (10)');
  });

  it('should clear license when selection is cleared', () => {
    const event = {
      originalEvent: new Event('change'),
      value: '',
    } as SelectChangeEvent;

    component.setLicenses(event);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new SetLicense('', ''));
    expect(mockStore.dispatch).toHaveBeenCalledWith(GetAllOptions);
  });
});
