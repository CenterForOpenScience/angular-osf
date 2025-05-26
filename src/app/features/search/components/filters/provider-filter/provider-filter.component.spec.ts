import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { SelectChangeEvent } from 'primeng/select';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderFilter } from '@osf/shared/models';

import { ResourceFiltersSelectors, SetProvider } from '../../resource-filters/store';
import { GetAllOptions, ResourceFiltersOptionsSelectors } from '../store';

import { ProviderFilterComponent } from './provider-filter.component';

describe('ProviderFilterComponent', () => {
  let component: ProviderFilterComponent;
  let fixture: ComponentFixture<ProviderFilterComponent>;

  const mockStore = {
    selectSignal: jest.fn(),
    dispatch: jest.fn(),
  };

  const mockProviders: ProviderFilter[] = [
    { id: '1', label: 'Provider 1', count: 5 },
    { id: '2', label: 'Provider 2', count: 3 },
    { id: '3', label: 'Provider 3', count: 2 },
  ];

  beforeEach(async () => {
    mockStore.selectSignal.mockImplementation((selector) => {
      if (selector === ResourceFiltersOptionsSelectors.getProviders) {
        return signal(mockProviders);
      }

      if (selector === ResourceFiltersSelectors.getProvider) {
        return signal({ label: '', value: '' });
      }

      return signal(null);
    });

    await TestBed.configureTestingModule({
      imports: [ProviderFilterComponent],
      providers: [MockProvider(Store, mockStore)],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty input text', () => {
    expect(component['inputText']()).toBeNull();
  });

  it('should show all providers when no search text is entered', () => {
    const options = component['providersOptions']();
    expect(options.length).toBe(3);
    expect(options[0].labelCount).toBe('Provider 1 (5)');
    expect(options[1].labelCount).toBe('Provider 2 (3)');
    expect(options[2].labelCount).toBe('Provider 3 (2)');
  });

  it('should filter providers based on search text', () => {
    component['inputText'].set('Provider 1');
    const options = component['providersOptions']();
    expect(options.length).toBe(1);
    expect(options[0].labelCount).toBe('Provider 1 (5)');
  });

  it('should clear provider when selection is cleared', () => {
    const event = {
      originalEvent: new Event('change'),
      value: '',
    } as SelectChangeEvent;

    component.setProviders(event);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new SetProvider('', ''));
    expect(mockStore.dispatch).toHaveBeenCalledWith(GetAllOptions);
  });
});
