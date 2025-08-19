import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_STORE } from '@shared/mocks';

import { MyProfileResourceFiltersSelectors } from '../../my-profile-resource-filters/store';
import { MyProfileResourceFiltersOptionsSelectors } from '../store';

import { MyProfileDateCreatedFilterComponent } from './my-profile-date-created-filter.component';

describe('MyProfileDateCreatedFilterComponent', () => {
  let component: MyProfileDateCreatedFilterComponent;
  let fixture: ComponentFixture<MyProfileDateCreatedFilterComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === MyProfileResourceFiltersOptionsSelectors.getDatesCreated) return () => [];
      if (selector === MyProfileResourceFiltersSelectors.getDateCreated) return () => ({ label: '', value: '' });
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [MyProfileDateCreatedFilterComponent],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileDateCreatedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
