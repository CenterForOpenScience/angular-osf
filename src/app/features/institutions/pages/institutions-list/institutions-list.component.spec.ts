import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ScheduledBannerComponent } from '@core/components/osf-banners/scheduled-banner/scheduled-banner.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { InstitutionsSelectors } from '@osf/shared/stores/institutions';

import { InstitutionsListComponent } from './institutions-list.component';

import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe.skip('Component: Institutions List', () => {
  let component: InstitutionsListComponent;
  let fixture: ComponentFixture<InstitutionsListComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;

  const mockInstitutions = [MOCK_INSTITUTION];
  const mockTotalCount = 2;

  beforeEach(async () => {
    routerMock = RouterMockBuilder.create().build();
    activatedRouteMock = ActivatedRouteMockBuilder.create()
      .withQueryParams({ page: '1', size: '10', search: '' })
      .build();

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
            { selector: InstitutionsSelectors.getInstitutionsTotalCount, value: mockTotalCount },
            { selector: InstitutionsSelectors.isInstitutionsLoading, value: false },
          ],
        }),
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, activatedRouteMock),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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
