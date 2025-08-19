import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileResourceFiltersOptionsSelectors } from '@osf/features/profile/components/filters/store';
import { ProfileSelectors } from '@osf/features/profile/store';
import { ResourceTab } from '@osf/shared/enums';
import { IS_WEB, IS_XSMALL } from '@osf/shared/helpers';
import { EMPTY_FILTERS, EMPTY_OPTIONS, MOCK_STORE, TranslateServiceMock } from '@osf/shared/mocks';

import { ProfileResourceFiltersSelectors } from '../profile-resource-filters/store';
import { ProfileResourcesComponent } from '..';

describe('ProfileResourcesComponent', () => {
  let component: ProfileResourcesComponent;
  let fixture: ComponentFixture<ProfileResourcesComponent>;
  let isWebSubject: BehaviorSubject<boolean>;
  let isMobileSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isWebSubject = new BehaviorSubject<boolean>(true);
    isMobileSubject = new BehaviorSubject<boolean>(false);

    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === ProfileSelectors.getResourceTab) return () => ResourceTab.All;
      if (selector === ProfileSelectors.getResourcesCount) return () => 0;
      if (selector === ProfileSelectors.getResources) return () => [];
      if (selector === ProfileSelectors.getSortBy) return () => '';
      if (selector === ProfileSelectors.getFirst) return () => '';
      if (selector === ProfileSelectors.getNext) return () => '';
      if (selector === ProfileSelectors.getPrevious) return () => '';

      if (selector === ProfileResourceFiltersSelectors.getAllFilters) return () => EMPTY_FILTERS;
      if (selector === ProfileResourceFiltersOptionsSelectors.getAllOptions) return () => EMPTY_OPTIONS;

      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [ProfileResourcesComponent],
      providers: [
        MockProvider(Store, MOCK_STORE),
        MockProvider(IS_WEB, isWebSubject),
        MockProvider(IS_XSMALL, isMobileSubject),
        TranslateServiceMock,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
