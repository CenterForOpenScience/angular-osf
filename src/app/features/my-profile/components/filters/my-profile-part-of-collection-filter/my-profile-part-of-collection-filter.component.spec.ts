import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_STORE } from '@shared/mocks';

import { MyProfileResourceFiltersSelectors } from '../../my-profile-resource-filters/store';
import { MyProfileResourceFiltersOptionsSelectors } from '../store';

import { MyProfilePartOfCollectionFilterComponent } from './my-profile-part-of-collection-filter.component';

describe('MyProfilePartOfCollectionFilterComponent', () => {
  let component: MyProfilePartOfCollectionFilterComponent;
  let fixture: ComponentFixture<MyProfilePartOfCollectionFilterComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === MyProfileResourceFiltersOptionsSelectors.getPartOfCollection) return () => [];
      if (selector === MyProfileResourceFiltersSelectors.getPartOfCollection) return () => ({ label: '', id: '' });
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [MyProfilePartOfCollectionFilterComponent],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfilePartOfCollectionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
