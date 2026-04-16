import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { Mock } from 'vitest';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadType } from '@osf/features/admin-institutions/enums';
import { InstitutionsAdminSelectors } from '@osf/features/admin-institutions/store';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { SortOrder } from '@osf/shared/enums/sort-order.enum';
import { SearchFilters } from '@osf/shared/models/search-filters.model';
import {
  FetchResources,
  FetchResourcesByLink,
  GlobalSearchSelectors,
  ResetSearchState,
  SetDefaultFilterValue,
  SetResourceType,
  SetSortBy,
} from '@osf/shared/stores/global-search';

import {
  MOCK_ADMIN_INSTITUTIONS_INSTITUTION,
  MOCK_ADMIN_INSTITUTIONS_REGISTRATION_RESOURCE,
  MOCK_ADMIN_INSTITUTIONS_REGISTRATION_RESOURCES,
} from '@testing/mocks/admin-institutions.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { AdminTableComponent } from '../../components/admin-table/admin-table.component';
import { FiltersSectionComponent } from '../../components/filters-section/filters-section.component';

import { InstitutionsRegistrationsComponent } from './institutions-registrations.component';

describe('InstitutionsRegistrationsComponent', () => {
  let component: InstitutionsRegistrationsComponent;
  let fixture: ComponentFixture<InstitutionsRegistrationsComponent>;
  let store: Store;
  let dispatchMock: Mock;
  let windowOpenSpy: Mock;

  const mockInstitution = { ...MOCK_ADMIN_INSTITUTIONS_INSTITUTION, id: 'inst-1' };
  const mockResources = MOCK_ADMIN_INSTITUTIONS_REGISTRATION_RESOURCES;

  const signals = [
    { selector: InstitutionsAdminSelectors.getInstitution, value: mockInstitution },
    { selector: GlobalSearchSelectors.getResources, value: mockResources },
    { selector: GlobalSearchSelectors.getResourcesCount, value: 1 },
    { selector: GlobalSearchSelectors.getResourcesLoading, value: false },
    { selector: GlobalSearchSelectors.getFirst, value: 'https://api.test.osf.io/v2/search/?page=1' },
    { selector: GlobalSearchSelectors.getNext, value: 'https://api.test.osf.io/v2/search/?page=2' },
    { selector: GlobalSearchSelectors.getPrevious, value: null },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InstitutionsRegistrationsComponent, ...MockComponents(AdminTableComponent, FiltersSectionComponent)],
      providers: [provideOSFCore(), provideMockStore({ signals })],
    });

    fixture = TestBed.createComponent(InstitutionsRegistrationsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    dispatchMock = store.dispatch as Mock;
    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(vi.fn()) as Mock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch actions on init', () => {
    expect(dispatchMock).toHaveBeenCalledWith(new SetResourceType(ResourceType.Registration));
    expect(dispatchMock).toHaveBeenCalledWith(new SetDefaultFilterValue('affiliation', mockInstitution.iris.join(',')));
    expect(dispatchMock).toHaveBeenCalledWith(new FetchResources());
  });

  it('should dispatch ResetSearchState on destroy', () => {
    dispatchMock.mockClear();

    component.ngOnDestroy();

    expect(dispatchMock).toHaveBeenCalledWith(new ResetSearchState());
  });

  it('should dispatch sort and fetch on sort change', () => {
    dispatchMock.mockClear();

    component.onSortChange({
      searchValue: '',
      searchFields: [],
      sortColumn: 'title',
      sortOrder: SortOrder.Asc,
    });

    expect(component.sortField()).toBe('title');
    expect(component.sortOrder()).toBe(SortOrder.Asc);
    expect(dispatchMock).toHaveBeenCalledWith(new SetSortBy('title'));
    expect(dispatchMock).toHaveBeenCalledWith(new FetchResources());
  });

  it('should use default sort when sort params are missing', () => {
    dispatchMock.mockClear();

    component.onSortChange({ searchValue: '', searchFields: [] } as unknown as SearchFilters);

    expect(component.sortField()).toBe('-dateModified');
    expect(component.sortOrder()).toBe(1);
    expect(dispatchMock).toHaveBeenCalledWith(new SetSortBy('-dateModified'));
  });

  it('should dispatch FetchResourcesByLink on page change', () => {
    dispatchMock.mockClear();
    const link = 'https://api.test.osf.io/v2/search/?page=2';

    component.onLinkPageChange(link);

    expect(dispatchMock).toHaveBeenCalledWith(new FetchResourcesByLink(link));
  });

  it('should call downloadResults for selected type', () => {
    const firstLink = 'https://api.test.osf.io/v2/search/?page=1';
    component.firstLink = signal(firstLink);

    component.download(DownloadType.CSV);

    expect(windowOpenSpy).toHaveBeenCalled();
  });

  it('should compute sortParam', () => {
    component.sortField.set('title');
    component.sortOrder.set(SortOrder.Asc);
    expect(component.sortParam()).toBe('title');

    component.sortOrder.set(SortOrder.Desc);
    expect(component.sortParam()).toBe('-title');
  });

  it('should compute pagination links from selectors', () => {
    const links = component.paginationLinks();

    expect(links.first?.href).toBe('https://api.test.osf.io/v2/search/?page=1');
    expect(links.next?.href).toBe('https://api.test.osf.io/v2/search/?page=2');
    expect(links.prev?.href).toBe(null);
  });

  it('should map resources into table data', () => {
    const tableData = component.tableData();

    expect(tableData).toHaveLength(1);
    expect(tableData[0]['title']).toBe(MOCK_ADMIN_INSTITUTIONS_REGISTRATION_RESOURCE.title);
  });
});
