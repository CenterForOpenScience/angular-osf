import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { provideRouter } from '@angular/router';

import { ScheduledBannerComponent } from '@core/components/osf-banners/scheduled-banner/scheduled-banner.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { FetchInstitutions, InstitutionsSelectors } from '@osf/shared/stores/institutions';

import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { InstitutionsListComponent } from './institutions-list.component';

describe('InstitutionsListComponent', () => {
  let component: InstitutionsListComponent;
  let fixture: ComponentFixture<InstitutionsListComponent>;
  let store: Store;

  const mockInstitutions = [MOCK_INSTITUTION];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        InstitutionsListComponent,
        ...MockComponents(SubHeaderComponent, SearchInputComponent, LoadingSpinnerComponent, ScheduledBannerComponent),
      ],
      providers: [
        provideOSFCore(),
        provideRouter([]),
        provideMockStore({
          signals: [
            { selector: InstitutionsSelectors.getInstitutions, value: mockInstitutions },
            { selector: InstitutionsSelectors.isInstitutionsLoading, value: false },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(InstitutionsListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch FetchInstitutions on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(FetchInstitutions));
    const action = (store.dispatch as Mock).mock.calls[0][0] as FetchInstitutions;
    expect(action.searchValue).toBeUndefined();
  });

  it('should dispatch FetchInstitutions with search value after debounce', () => {
    vi.useFakeTimers();
    (store.dispatch as Mock).mockClear();

    component.searchControl.setValue('test search');
    vi.advanceTimersByTime(300);

    expect(store.dispatch).toHaveBeenCalledWith(new FetchInstitutions('test search'));
  });

  it('should dispatch FetchInstitutions with empty string when search is null', () => {
    vi.useFakeTimers();
    (store.dispatch as Mock).mockClear();

    component.searchControl.setValue(null);
    vi.advanceTimersByTime(300);

    expect(store.dispatch).toHaveBeenCalledWith(new FetchInstitutions(''));
  });

  it('should not dispatch another search action for unchanged value', () => {
    vi.useFakeTimers();
    (store.dispatch as Mock).mockClear();

    component.searchControl.setValue('same value');
    vi.advanceTimersByTime(300);
    component.searchControl.setValue('same value');
    vi.advanceTimersByTime(300);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(new FetchInstitutions('same value'));
  });

  it('should initialize with correct default values', () => {
    expect(component.classes).toBe('flex-1 flex flex-column w-full');
    expect(component.searchControl).toBeInstanceOf(FormControl);
    expect(component.searchControl.value).toBe('');
  });

  it('should return institutions from store', () => {
    expect(component.institutions()).toBe(mockInstitutions);
  });

  it('should return loading state from store', () => {
    expect(component.institutionsLoading()).toBe(false);
  });
});
