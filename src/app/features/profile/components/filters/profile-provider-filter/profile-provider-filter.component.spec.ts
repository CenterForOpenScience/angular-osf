import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileResourceFiltersOptionsSelectors } from '@osf/features/profile/components/filters/store';
import { MOCK_STORE } from '@osf/shared/mocks';

import { ProfileResourceFiltersSelectors } from '../../profile-resource-filters/store';

import { ProfileProviderFilterComponent } from './profile-provider-filter.component';

describe('ProfileProviderFilterComponent', () => {
  let component: ProfileProviderFilterComponent;
  let fixture: ComponentFixture<ProfileProviderFilterComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === ProfileResourceFiltersOptionsSelectors.getProviders) return () => [];
      if (selector === ProfileResourceFiltersSelectors.getProvider) return () => ({ label: '', id: '' });
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [ProfileProviderFilterComponent],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileProviderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
