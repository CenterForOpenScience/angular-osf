import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { ResourceFiltersSelectors } from '../../resource-filters/store';
import { ResourceFiltersOptionsSelectors } from '../store';

import { ResourceTypeFilterComponent } from './resource-type-filter.component';

describe('ResourceTypeFilterComponent', () => {
  let component: ResourceTypeFilterComponent;
  let fixture: ComponentFixture<ResourceTypeFilterComponent>;

  const mockStore = {
    selectSignal: jest.fn(),
    dispatch: jest.fn(),
  };

  const mockResourceTypes = [
    { id: '1', label: 'Article', count: 10 },
    { id: '2', label: 'Dataset', count: 5 },
    { id: '3', label: 'Preprint', count: 8 },
  ];

  beforeEach(async () => {
    mockStore.selectSignal.mockImplementation((selector) => {
      if (selector === ResourceFiltersOptionsSelectors.getResourceTypes) return () => mockResourceTypes;
      if (selector === ResourceFiltersSelectors.getResourceType) return () => ({ label: '', id: '' });
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [ResourceTypeFilterComponent],
      providers: [MockProvider(Store, mockStore), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty resource type', () => {
    expect(component['inputText']()).toBeNull();
  });

  it('should clear input text when store value is cleared', () => {
    mockStore.selectSignal.mockImplementation((selector) => {
      if (selector === ResourceFiltersSelectors.getResourceType) return () => ({ label: 'Article', id: '1' });
      return mockStore.selectSignal(selector);
    });
    fixture.detectChanges();

    mockStore.selectSignal.mockImplementation((selector) => {
      if (selector === ResourceFiltersSelectors.getResourceType) return () => ({ label: '', id: '' });
      return mockStore.selectSignal(selector);
    });
    fixture.detectChanges();

    expect(component['inputText']()).toBeNull();
  });

  it('should filter resource types based on input text', () => {
    component['inputText'].set('art');
    fixture.detectChanges();

    const options = component['resourceTypesOptions']();
    expect(options.length).toBe(1);
    expect(options[0].label).toBe('Article');
  });

  it('should show all resource types when input text is null', () => {
    component['inputText'].set(null);
    fixture.detectChanges();

    const options = component['resourceTypesOptions']();
    expect(options.length).toBe(3);
    expect(options.map((opt) => opt.label)).toEqual(['Article', 'Dataset', 'Preprint']);
  });

  it('should format resource type options with count', () => {
    const options = component['resourceTypesOptions']();
    expect(options[0].labelCount).toBe('Article (10)');
    expect(options[1].labelCount).toBe('Dataset (5)');
    expect(options[2].labelCount).toBe('Preprint (8)');
  });
});
