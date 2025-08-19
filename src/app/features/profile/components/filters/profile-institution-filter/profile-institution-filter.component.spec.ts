import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileResourceFiltersOptionsSelectors } from '@osf/features/profile/components/filters/store';
import { MOCK_STORE } from '@osf/shared/mocks';

import { ProfileResourceFiltersSelectors } from '../../profile-resource-filters/store';

import { ProfileInstitutionFilterComponent } from './profile-institution-filter.component';

describe('ProfileInstitutionFilterComponent', () => {
  let component: ProfileInstitutionFilterComponent;
  let fixture: ComponentFixture<ProfileInstitutionFilterComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === ProfileResourceFiltersOptionsSelectors.getInstitutions) return () => [];
      if (selector === ProfileResourceFiltersSelectors.getInstitution) return () => ({ label: '', id: '' });
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [ProfileInstitutionFilterComponent],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileInstitutionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
