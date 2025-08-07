import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintsResourcesFiltersSelectors } from '@osf/features/preprints/store/preprints-resources-filters';
import { EMPTY_FILTERS, MOCK_STORE } from '@shared/mocks';

import { PreprintsFilterChipsComponent } from './preprints-filter-chips.component';

describe('PreprintsFilterChipsComponent', () => {
  let component: PreprintsFilterChipsComponent;
  let fixture: ComponentFixture<PreprintsFilterChipsComponent>;

  const mockStore = MOCK_STORE;

  beforeEach(async () => {
    (mockStore.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === PreprintsResourcesFiltersSelectors.getAllFilters) return () => EMPTY_FILTERS;
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [PreprintsFilterChipsComponent],
      providers: [MockProvider(Store, mockStore)],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsFilterChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
