import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileSelectors } from '@osf/features/my-profile/store';
import { MOCK_STORE } from '@shared/mocks';

import { MyProfileResourceFiltersOptionsSelectors } from '../filters/store';

import { MyProfileResourceFiltersComponent } from './my-profile-resource-filters.component';

describe('MyProfileResourceFiltersComponent', () => {
  let component: MyProfileResourceFiltersComponent;
  let fixture: ComponentFixture<MyProfileResourceFiltersComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      const optionsSelectors = [
        MyProfileResourceFiltersOptionsSelectors.getDatesCreated,
        MyProfileResourceFiltersOptionsSelectors.getFunders,
        MyProfileResourceFiltersOptionsSelectors.getSubjects,
        MyProfileResourceFiltersOptionsSelectors.getLicenses,
        MyProfileResourceFiltersOptionsSelectors.getResourceTypes,
        MyProfileResourceFiltersOptionsSelectors.getInstitutions,
        MyProfileResourceFiltersOptionsSelectors.getProviders,
        MyProfileResourceFiltersOptionsSelectors.getPartOfCollection,
      ];

      if (optionsSelectors.includes(selector)) return () => [];

      if (selector === MyProfileSelectors.getIsMyProfile) return () => true;

      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [MyProfileResourceFiltersComponent],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileResourceFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
