import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileResourceFiltersOptionsSelectors } from '@osf/features/profile/components/filters/store';
import { MyProfileResourceFiltersSelectors } from '@osf/features/profile/components/my-profile-resource-filters/store';
import { MOCK_STORE } from '@osf/shared/mocks';

import { ProfilePartOfCollectionFilterComponent } from './profile-part-of-collection-filter.component';

describe('ProfilePartOfCollectionFilterComponent', () => {
  let component: ProfilePartOfCollectionFilterComponent;
  let fixture: ComponentFixture<ProfilePartOfCollectionFilterComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === ProfileResourceFiltersOptionsSelectors.getPartOfCollection) return () => [];
      if (selector === MyProfileResourceFiltersSelectors.getPartOfCollection) return () => ({ label: '', id: '' });
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [ProfilePartOfCollectionFilterComponent],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePartOfCollectionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
