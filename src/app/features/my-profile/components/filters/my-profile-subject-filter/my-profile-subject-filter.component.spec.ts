import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_STORE } from '@shared/mocks';

import { MyProfileResourceFiltersSelectors } from '../../my-profile-resource-filters/store';
import { MyProfileResourceFiltersOptionsSelectors } from '../store';

import { MyProfileSubjectFilterComponent } from './my-profile-subject-filter.component';

describe('MyProfileSubjectFilterComponent', () => {
  let component: MyProfileSubjectFilterComponent;
  let fixture: ComponentFixture<MyProfileSubjectFilterComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === MyProfileResourceFiltersOptionsSelectors.getSubjects) return () => [];
      if (selector === MyProfileResourceFiltersSelectors.getSubject) return () => ({ label: '', id: '' });
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [MyProfileSubjectFilterComponent],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileSubjectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
