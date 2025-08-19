import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileResourceFiltersOptionsSelectors } from '@osf/features/profile/components/filters/store';
import { MOCK_STORE } from '@osf/shared/mocks';

import { ProfileResourceFiltersSelectors } from '../../profile-resource-filters/store';

import { ProfileLicenseFilterComponent } from './profile-license-filter.component';

describe('ProfileLicenseFilterComponent', () => {
  let component: ProfileLicenseFilterComponent;
  let fixture: ComponentFixture<ProfileLicenseFilterComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === ProfileResourceFiltersOptionsSelectors.getLicenses) return () => [];
      if (selector === ProfileResourceFiltersSelectors.getLicense) return () => ({ label: '', id: '' });
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [ProfileLicenseFilterComponent],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileLicenseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
