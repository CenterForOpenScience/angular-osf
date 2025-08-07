import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintsDiscoverSelectors } from '@osf/features/preprints/store/preprints-discover';
import { PreprintsResourcesFiltersSelectors } from '@osf/features/preprints/store/preprints-resources-filters';
import { PreprintsResourcesFiltersOptionsSelectors } from '@osf/features/preprints/store/preprints-resources-filters-options';
import { EMPTY_FILTERS, MOCK_STORE, TranslateServiceMock } from '@shared/mocks';
import { IS_WEB, IS_XSMALL } from '@shared/utils';

import { PreprintsResourcesComponent } from './preprints-resources.component';

describe('PreprintsResourcesComponent', () => {
  let component: PreprintsResourcesComponent;
  let fixture: ComponentFixture<PreprintsResourcesComponent>;

  const mockStore = MOCK_STORE;
  let isWebSubject: BehaviorSubject<boolean>;
  let isMobileSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isWebSubject = new BehaviorSubject<boolean>(true);
    isMobileSubject = new BehaviorSubject<boolean>(false);

    (mockStore.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === PreprintsDiscoverSelectors.getResources) return () => [];
      if (selector === PreprintsDiscoverSelectors.getResourcesCount) return () => 0;
      if (selector === PreprintsDiscoverSelectors.getSortBy) return () => '';
      if (selector === PreprintsDiscoverSelectors.getFirst) return () => '';
      if (selector === PreprintsDiscoverSelectors.getNext) return () => '';
      if (selector === PreprintsDiscoverSelectors.getPrevious) return () => '';

      if (selector === PreprintsResourcesFiltersSelectors.getAllFilters) return () => EMPTY_FILTERS;
      if (selector === PreprintsResourcesFiltersOptionsSelectors.isAnyFilterOptions) return () => false;
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [PreprintsResourcesComponent, MockPipe(TranslatePipe)],
      providers: [
        MockProvider(Store, mockStore),
        MockProvider(IS_WEB, isWebSubject),
        MockProvider(IS_XSMALL, isMobileSubject),
        TranslateServiceMock,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
