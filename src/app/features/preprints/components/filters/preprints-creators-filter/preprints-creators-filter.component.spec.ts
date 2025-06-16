import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { SelectChangeEvent } from 'primeng/select';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  PreprintsResourcesFiltersSelectors,
  SetCreator,
} from '@osf/features/preprints/store/preprints-resources-filters';
import {
  GetAllOptions,
  PreprintsResourcesFiltersOptionsSelectors,
} from '@osf/features/preprints/store/preprints-resources-filters-options';
import { mockStore } from '@osf/shared/mocks';
import { Creator } from '@osf/shared/models';

import { PreprintsCreatorsFilterComponent } from './preprints-creators-filter.component';

describe('CreatorsFilterComponent', () => {
  let component: PreprintsCreatorsFilterComponent;
  let fixture: ComponentFixture<PreprintsCreatorsFilterComponent>;

  const store = mockStore;

  const mockCreators: Creator[] = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Bob Johnson' },
  ];

  beforeEach(async () => {
    store.selectSignal.mockImplementation((selector) => {
      if (selector === PreprintsResourcesFiltersOptionsSelectors.getCreators) {
        return signal(mockCreators);
      }

      if (selector === PreprintsResourcesFiltersSelectors.getCreator) {
        return signal({ label: '', value: '' });
      }

      return signal(null);
    });

    await TestBed.configureTestingModule({
      imports: [PreprintsCreatorsFilterComponent],
      providers: [MockProvider(Store, store)],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsCreatorsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty input', () => {
    expect(component['creatorsInput']()).toBeNull();
  });

  it('should show all creators when no search text is entered', () => {
    const options = component['creatorsOptions']();
    expect(options.length).toBe(3);
    expect(options[0].label).toBe('John Doe');
    expect(options[1].label).toBe('Jane Smith');
    expect(options[2].label).toBe('Bob Johnson');
  });

  it('should set creator when a valid selection is made', () => {
    const event = {
      originalEvent: { pointerId: 1 } as unknown as PointerEvent,
      value: 'John Doe',
    } as SelectChangeEvent;

    component.setCreator(event);
    expect(store.dispatch).toHaveBeenCalledWith(new SetCreator('John Doe', '1'));
    expect(store.dispatch).toHaveBeenCalledWith(GetAllOptions);
  });
});
