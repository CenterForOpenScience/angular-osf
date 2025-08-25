import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileResourceFiltersSelectors } from '@osf/features/my-profile/components/my-profile-resource-filters/store';
import { MyProfileSelectors } from '@osf/features/my-profile/store';
import { EMPTY_FILTERS, MOCK_STORE } from '@osf/shared/mocks';

import { ProfileFilterChipsComponent } from './profile-filter-chips.component';

describe('ProfileFilterChipsComponent', () => {
  let component: ProfileFilterChipsComponent;
  let fixture: ComponentFixture<ProfileFilterChipsComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === MyProfileResourceFiltersSelectors.getAllFilters) return () => EMPTY_FILTERS;
      if (selector === MyProfileSelectors.getIsMyProfile) return () => true;
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [ProfileFilterChipsComponent],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileFilterChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
