import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { SelectChangeEvent } from 'primeng/select';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartOfCollectionFilter } from '../../models/part-of-collection/part-of-collection-filter.entity';
import { ResourceFiltersSelectors, SetPartOfCollection } from '../../store';
import { GetAllOptions } from '../store/resource-filters-options.actions';
import { ResourceFiltersOptionsSelectors } from '../store/resource-filters-options.selectors';

import { PartOfCollectionFilterComponent } from './part-of-collection-filter.component';

describe('PartOfCollectionFilterComponent', () => {
  let component: PartOfCollectionFilterComponent;
  let fixture: ComponentFixture<PartOfCollectionFilterComponent>;

  const mockStore = {
    selectSignal: jest.fn(),
    dispatch: jest.fn(),
  };

  const mockCollections: PartOfCollectionFilter[] = [
    { id: '1', label: 'Collection 1', count: 5 },
    { id: '2', label: 'Collection 2', count: 3 },
    { id: '3', label: 'Collection 3', count: 2 },
  ];

  beforeEach(async () => {
    mockStore.selectSignal.mockImplementation((selector) => {
      if (selector === ResourceFiltersOptionsSelectors.getPartOfCollection) {
        return signal(mockCollections);
      }

      if (selector === ResourceFiltersSelectors.getPartOfCollection) {
        return signal({ label: '', value: '' });
      }

      return signal(null);
    });

    await TestBed.configureTestingModule({
      imports: [PartOfCollectionFilterComponent],
      providers: [MockProvider(Store, mockStore)],
    }).compileComponents();

    fixture = TestBed.createComponent(PartOfCollectionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty input text', () => {
    expect(component['inputText']()).toBeNull();
  });

  it('should show all collections when no search text is entered', () => {
    const options = component['partOfCollectionsOptions']();
    expect(options.length).toBe(3);
    expect(options[0].labelCount).toBe('Collection 1 (5)');
    expect(options[1].labelCount).toBe('Collection 2 (3)');
    expect(options[2].labelCount).toBe('Collection 3 (2)');
  });

  it('should clear collection when selection is cleared', () => {
    const event = {
      originalEvent: new Event('change'),
      value: '',
    } as SelectChangeEvent;

    component.setPartOfCollections(event);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new SetPartOfCollection('', ''));
    expect(mockStore.dispatch).toHaveBeenCalledWith(GetAllOptions);
  });
});
