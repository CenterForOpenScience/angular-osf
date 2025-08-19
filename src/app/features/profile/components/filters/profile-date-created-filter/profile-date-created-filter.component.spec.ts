import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileResourceFiltersOptionsSelectors } from '@osf/features/profile/components/filters/store';
import { MOCK_STORE } from '@osf/shared/mocks';

import { ProfileResourceFiltersSelectors } from '../../profile-resource-filters/store';

import { ProfileDateCreatedFilterComponent } from './profile-date-created-filter.component';

describe('ProfileDateCreatedFilterComponent', () => {
  let component: ProfileDateCreatedFilterComponent;
  let fixture: ComponentFixture<ProfileDateCreatedFilterComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === ProfileResourceFiltersOptionsSelectors.getDatesCreated) return () => [];
      if (selector === ProfileResourceFiltersSelectors.getDateCreated) return () => ({ label: '', value: '' });
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [ProfileDateCreatedFilterComponent],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileDateCreatedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
