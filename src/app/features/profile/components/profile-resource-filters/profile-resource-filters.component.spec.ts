import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileSelectors } from '@osf/features/my-profile/store';
import { ProfileResourceFiltersOptionsSelectors } from '@osf/features/profile/components/filters/store';
import { MOCK_STORE } from '@osf/shared/mocks';

import { ProfileResourceFiltersComponent } from './profile-resource-filters.component';

describe('ProfileResourceFiltersComponent', () => {
  let component: ProfileResourceFiltersComponent;
  let fixture: ComponentFixture<ProfileResourceFiltersComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      const optionsSelectors = [
        ProfileResourceFiltersOptionsSelectors.getDatesCreated,
        ProfileResourceFiltersOptionsSelectors.getFunders,
        ProfileResourceFiltersOptionsSelectors.getSubjects,
        ProfileResourceFiltersOptionsSelectors.getLicenses,
        ProfileResourceFiltersOptionsSelectors.getResourceTypes,
        ProfileResourceFiltersOptionsSelectors.getInstitutions,
        ProfileResourceFiltersOptionsSelectors.getProviders,
        ProfileResourceFiltersOptionsSelectors.getPartOfCollection,
      ];

      if (optionsSelectors.includes(selector)) return () => [];

      if (selector === MyProfileSelectors.getIsMyProfile) return () => true;

      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [ProfileResourceFiltersComponent],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileResourceFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
