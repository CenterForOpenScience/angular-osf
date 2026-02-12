import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { ScheduledBannerComponent } from '@core/components/osf-banners/scheduled-banner/scheduled-banner.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { FetchInstitutions, InstitutionsSelectors } from '@osf/shared/stores/institutions';

import { InstitutionsListComponent } from './institutions-list.component';

import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('InstitutionsListComponent', () => {
  let component: InstitutionsListComponent;
  let fixture: ComponentFixture<InstitutionsListComponent>;
  let store: Store;

  const mockInstitutions = [MOCK_INSTITUTION];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InstitutionsListComponent,
        OSFTestingModule,
        ...MockComponents(SubHeaderComponent, SearchInputComponent, LoadingSpinnerComponent, ScheduledBannerComponent),
      ],
      providers: [
        provideMockStore({
          signals: [
            { selector: InstitutionsSelectors.getInstitutions, value: mockInstitutions },
            { selector: InstitutionsSelectors.isInstitutionsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch FetchInstitutions on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(FetchInstitutions));
    const action = (store.dispatch as jest.Mock).mock.calls[0][0] as FetchInstitutions;
    expect(action.searchValue).toBeUndefined();
  });

  it('should dispatch FetchInstitutions with search value after debounce', fakeAsync(() => {
    (store.dispatch as jest.Mock).mockClear();
    component.searchControl.setValue('test search');
    tick(300);
    expect(store.dispatch).toHaveBeenCalledWith(new FetchInstitutions('test search'));
  }));

  it('should dispatch FetchInstitutions with empty string when search is null', fakeAsync(() => {
    (store.dispatch as jest.Mock).mockClear();
    component.searchControl.setValue(null);
    tick(300);
    expect(store.dispatch).toHaveBeenCalledWith(new FetchInstitutions(''));
  }));

  it('should initialize with correct default values', () => {
    expect(component.classes).toBe('flex-1 flex flex-column w-full');
    expect(component.searchControl).toBeInstanceOf(FormControl);
    expect(component.searchControl.value).toBe('');
  });

  it('should return institutions from store', () => {
    const institutions = component.institutions();
    expect(institutions).toBe(mockInstitutions);
  });

  it('should return loading state from store', () => {
    const loading = component.institutionsLoading();
    expect(loading).toBe(false);
  });

  it('should handle search control value changes', () => {
    const searchValue = 'test search';
    component.searchControl.setValue(searchValue);

    expect(component.searchControl.value).toBe(searchValue);
  });

  it('should handle empty search', () => {
    component.searchControl.setValue('');

    expect(component.searchControl.value).toBe('');
  });

  it('should handle null search value', () => {
    component.searchControl.setValue(null);

    expect(component.searchControl.value).toBe(null);
  });
});
