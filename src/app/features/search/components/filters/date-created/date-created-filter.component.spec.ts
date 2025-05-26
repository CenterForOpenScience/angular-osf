import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { Select, SelectChangeEvent } from 'primeng/select';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { mockStore } from '@osf/shared/mocks';
import { DateCreated } from '@osf/shared/models';

import { ResourceFiltersSelectors, SetDateCreated } from '../../resource-filters/store';
import { GetAllOptions, ResourceFiltersOptionsSelectors } from '../store';

import { DateCreatedFilterComponent } from './date-created-filter.component';

describe('DateCreatedFilterComponent', () => {
  let component: DateCreatedFilterComponent;
  let fixture: ComponentFixture<DateCreatedFilterComponent>;

  const store = mockStore;

  const mockDates: DateCreated[] = [
    { value: '2024', count: 150 },
    { value: '2023', count: 200 },
    { value: '2022', count: 180 },
  ];

  beforeEach(async () => {
    store.selectSignal.mockImplementation((selector) => {
      if (selector === ResourceFiltersOptionsSelectors.getDatesCreated) {
        return signal(mockDates);
      }

      if (selector === ResourceFiltersSelectors.getDateCreated) {
        return signal({ label: '', value: '' });
      }

      return signal(null);
    });

    await TestBed.configureTestingModule({
      imports: [DateCreatedFilterComponent, FormsModule, Select],
      providers: [MockProvider(Store, store)],
    }).compileComponents();

    fixture = TestBed.createComponent(DateCreatedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty input date', () => {
    expect(component['inputDate']()).toBeNull();
  });

  it('should show all dates with their counts', () => {
    const options = component['datesOptions']();
    expect(options.length).toBe(3);
    expect(options[0].label).toBe('2024 (150)');
    expect(options[1].label).toBe('2023 (200)');
    expect(options[2].label).toBe('2022 (180)');
  });

  it('should set date when a valid selection is made', () => {
    const event = {
      originalEvent: { pointerId: 1 } as unknown as PointerEvent,
      value: '2023',
    } as SelectChangeEvent;

    component.setDateCreated(event);
    expect(store.dispatch).toHaveBeenCalledWith(new SetDateCreated('2023'));
    expect(store.dispatch).toHaveBeenCalledWith(GetAllOptions);
  });
});
