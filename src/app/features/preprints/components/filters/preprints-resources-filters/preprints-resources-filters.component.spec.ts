import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintsResourcesFiltersComponent } from '@osf/features/preprints/components';
import { PreprintsResourcesFiltersOptionsSelectors } from '@osf/features/preprints/store/preprints-resources-filters-options';
import { MOCK_STORE } from '@osf/shared/mocks';

describe('PreprintsResourcesFiltersComponent', () => {
  let component: PreprintsResourcesFiltersComponent;
  let fixture: ComponentFixture<PreprintsResourcesFiltersComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (
        selector === PreprintsResourcesFiltersOptionsSelectors.getDatesCreated ||
        selector === PreprintsResourcesFiltersOptionsSelectors.getSubjects ||
        selector === PreprintsResourcesFiltersOptionsSelectors.getInstitutions ||
        selector === PreprintsResourcesFiltersOptionsSelectors.getLicenses
      ) {
        return signal([]);
      }
      return signal(null);
    });

    await TestBed.configureTestingModule({
      imports: [PreprintsResourcesFiltersComponent],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsResourcesFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
