import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceTab } from '@osf/shared/enums';
import { IS_WEB, IS_XSMALL } from '@osf/shared/utils';
import { EMPTY_FILTERS, EMPTY_OPTIONS, MOCK_STORE, TranslateServiceMock } from '@shared/mocks';

import { MyProfileSelectors } from '../../store';
import { MyProfileResourceFiltersOptionsSelectors } from '../filters/store';
import { MyProfileResourceFiltersSelectors } from '../my-profile-resource-filters/store';

import { MyProfileResourcesComponent } from './my-profile-resources.component';

describe('MyProfileResourcesComponent', () => {
  let component: MyProfileResourcesComponent;
  let fixture: ComponentFixture<MyProfileResourcesComponent>;
  let isWebSubject: BehaviorSubject<boolean>;
  let isMobileSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isWebSubject = new BehaviorSubject<boolean>(true);
    isMobileSubject = new BehaviorSubject<boolean>(false);

    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === MyProfileSelectors.getResourceTab) return () => ResourceTab.All;
      if (selector === MyProfileSelectors.getResourcesCount) return () => 0;
      if (selector === MyProfileSelectors.getResources) return () => [];
      if (selector === MyProfileSelectors.getSortBy) return () => '';
      if (selector === MyProfileSelectors.getFirst) return () => '';
      if (selector === MyProfileSelectors.getNext) return () => '';
      if (selector === MyProfileSelectors.getPrevious) return () => '';

      if (selector === MyProfileResourceFiltersSelectors.getAllFilters) return () => EMPTY_FILTERS;
      if (selector === MyProfileResourceFiltersOptionsSelectors.getAllOptions) return () => EMPTY_OPTIONS;

      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [MyProfileResourcesComponent],
      providers: [
        MockProvider(Store, MOCK_STORE),
        MockProvider(IS_WEB, isWebSubject),
        MockProvider(IS_XSMALL, isMobileSubject),
        TranslateServiceMock,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
