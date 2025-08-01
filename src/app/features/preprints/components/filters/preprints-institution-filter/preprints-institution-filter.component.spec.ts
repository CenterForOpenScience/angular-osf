import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { SelectChangeEvent } from 'primeng/select';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  PreprintsResourcesFiltersSelectors,
  SetInstitution,
} from '@osf/features/preprints/store/preprints-resources-filters';
import {
  GetAllOptions,
  PreprintsResourcesFiltersOptionsSelectors,
} from '@osf/features/preprints/store/preprints-resources-filters-options';
import { MOCK_STORE } from '@osf/shared/mocks';
import { InstitutionFilter } from '@osf/shared/models';

import { PreprintsInstitutionFilterComponent } from './preprints-institution-filter.component';

describe('InstitutionFilterComponent', () => {
  let component: PreprintsInstitutionFilterComponent;
  let fixture: ComponentFixture<PreprintsInstitutionFilterComponent>;

  const store = MOCK_STORE;

  const mockInstitutions: InstitutionFilter[] = [
    { id: '1', label: 'Harvard University', count: 15 },
    { id: '2', label: 'MIT', count: 12 },
    { id: '3', label: 'Stanford University', count: 8 },
  ];

  beforeEach(async () => {
    store.selectSignal.mockImplementation((selector) => {
      if (selector === PreprintsResourcesFiltersOptionsSelectors.getInstitutions) {
        return signal(mockInstitutions);
      }

      if (selector === PreprintsResourcesFiltersSelectors.getInstitution) {
        return signal({ label: '', value: '' });
      }

      return signal(null);
    });

    await TestBed.configureTestingModule({
      imports: [PreprintsInstitutionFilterComponent],
      providers: [MockProvider(Store, store)],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsInstitutionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty input text', () => {
    expect(component['inputText']()).toBeNull();
  });

  it('should show all institutions when no search text is entered', () => {
    const options = component['institutionsOptions']();
    expect(options.length).toBe(3);
    expect(options[0].labelCount).toBe('Harvard University (15)');
    expect(options[1].labelCount).toBe('MIT (12)');
    expect(options[2].labelCount).toBe('Stanford University (8)');
  });

  it('should filter institutions based on search text', () => {
    component['inputText'].set('MIT');
    const options = component['institutionsOptions']();
    expect(options.length).toBe(1);
    expect(options[0].labelCount).toBe('MIT (12)');
  });

  it('should clear institution when selection is cleared', () => {
    const event = {
      originalEvent: new Event('change'),
      value: '',
    } as SelectChangeEvent;

    component.setInstitutions(event);
    expect(store.dispatch).toHaveBeenCalledWith(new SetInstitution('', ''));
    expect(store.dispatch).toHaveBeenCalledWith(GetAllOptions);
  });
});
