import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileResourceFiltersOptionsSelectors } from '@osf/features/profile/components/filters/store';
import { MOCK_STORE } from '@osf/shared/mocks';

import { ProfileResourceFiltersSelectors } from '../../profile-resource-filters/store';

import { ProfileResourceTypeFilterComponent } from './profile-resource-type-filter.component';

describe('ProfileResourceTypeFilterComponent', () => {
  let component: ProfileResourceTypeFilterComponent;
  let fixture: ComponentFixture<ProfileResourceTypeFilterComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === ProfileResourceFiltersOptionsSelectors.getResourceTypes) return () => [];
      if (selector === ProfileResourceFiltersSelectors.getResourceType) return () => ({ label: '', id: '' });
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [ProfileResourceTypeFilterComponent],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileResourceTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
