import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_STORE } from '@shared/mocks';

import { MyProfileResourceFiltersSelectors } from '../../my-profile-resource-filters/store';
import { MyProfileResourceFiltersOptionsSelectors } from '../store';

import { MyProfileInstitutionFilterComponent } from './my-profile-institution-filter.component';

describe('MyProfileInstitutionFilterComponent', () => {
  let component: MyProfileInstitutionFilterComponent;
  let fixture: ComponentFixture<MyProfileInstitutionFilterComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === MyProfileResourceFiltersOptionsSelectors.getInstitutions) return () => [];
      if (selector === MyProfileResourceFiltersSelectors.getInstitution) return () => ({ label: '', id: '' });
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [MyProfileInstitutionFilterComponent],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileInstitutionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
