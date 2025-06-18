import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { SelectChangeEvent } from 'primeng/select';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_STORE } from '@osf/shared/mocks';
import { Creator } from '@osf/shared/models';

import { ResourceFiltersSelectors, SetCreator } from '../../resource-filters/store';
import { GetAllOptions, ResourceFiltersOptionsSelectors } from '../store';

import { CreatorsFilterComponent } from './creators-filter.component';

describe('CreatorsFilterComponent', () => {
  let component: CreatorsFilterComponent;
  let fixture: ComponentFixture<CreatorsFilterComponent>;

  const store = MOCK_STORE;

  const mockCreators: Creator[] = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Bob Johnson' },
  ];

  beforeEach(async () => {
    store.selectSignal.mockImplementation((selector) => {
      if (selector === ResourceFiltersOptionsSelectors.getCreators) {
        return signal(mockCreators);
      }

      if (selector === ResourceFiltersSelectors.getCreator) {
        return signal({ label: '', value: '' });
      }

      return signal(null);
    });

    await TestBed.configureTestingModule({
      imports: [CreatorsFilterComponent],
      providers: [MockProvider(Store, store)],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatorsFilterComponent);
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
