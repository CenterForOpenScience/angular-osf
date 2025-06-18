import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_STORE } from '@osf/shared/mocks';
import { FunderFilter } from '@osf/shared/models';

import { ResourceFiltersSelectors } from '../../resource-filters/store';
import { ResourceFiltersOptionsSelectors } from '../store';

import { FunderFilterComponent } from './funder-filter.component';

describe('FunderFilterComponent', () => {
  let component: FunderFilterComponent;
  let fixture: ComponentFixture<FunderFilterComponent>;

  const store = MOCK_STORE;

  const mockFunders: FunderFilter[] = [
    { id: '1', label: 'National Science Foundation', count: 25 },
    { id: '2', label: 'National Institutes of Health', count: 18 },
    { id: '3', label: 'Department of Energy', count: 12 },
  ];

  beforeEach(async () => {
    store.selectSignal.mockImplementation((selector) => {
      if (selector === ResourceFiltersOptionsSelectors.getFunders) {
        return signal(mockFunders);
      }

      if (selector === ResourceFiltersSelectors.getFunder) {
        return signal({ label: '', value: '' });
      }

      return signal(null);
    });

    await TestBed.configureTestingModule({
      imports: [FunderFilterComponent],
      providers: [MockProvider(Store, store)],
    }).compileComponents();

    fixture = TestBed.createComponent(FunderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty input text', () => {
    expect(component['inputText']()).toBeNull();
  });

  it('should show all funders when no search text is entered', () => {
    const options = component['fundersOptions']();
    expect(options.length).toBe(3);
    expect(options[0].labelCount).toBe('National Science Foundation (25)');
    expect(options[1].labelCount).toBe('National Institutes of Health (18)');
    expect(options[2].labelCount).toBe('Department of Energy (12)');
  });
});
