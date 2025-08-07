import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_STORE } from '@shared/mocks';

import { MyProfileResourceFiltersSelectors } from '../../my-profile-resource-filters/store';
import { MyProfileResourceFiltersOptionsSelectors } from '../store';

import { MyProfileFunderFilterComponent } from './my-profile-funder-filter.component';

describe('MyProfileFunderFilterComponent', () => {
  let component: MyProfileFunderFilterComponent;
  let fixture: ComponentFixture<MyProfileFunderFilterComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === MyProfileResourceFiltersOptionsSelectors.getFunders) return () => [];
      if (selector === MyProfileResourceFiltersSelectors.getFunder) return () => ({ label: '', id: '' });
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [MyProfileFunderFilterComponent],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileFunderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
