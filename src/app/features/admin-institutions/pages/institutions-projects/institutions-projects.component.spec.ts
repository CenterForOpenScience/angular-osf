import { Store } from '@ngxs/store';

import { MockComponents, MockProvider, MockProviders } from 'ng-mocks';

import { of } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { AdminTableComponent } from '@osf/features/admin-institutions/components';
import { DownloadType } from '@osf/features/admin-institutions/enums';
import * as downloadHelper from '@osf/features/admin-institutions/helpers';
import { TableColumn, TableIconClickEvent } from '@osf/features/admin-institutions/models';
import { InstitutionsAdminSelectors } from '@osf/features/admin-institutions/store';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { SortOrder } from '@osf/shared/enums/sort-order.enum';
import { SearchFilters } from '@osf/shared/models/search-filters.model';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import {
  FetchResources,
  FetchResourcesByLink,
  GlobalSearchSelectors,
  ResetSearchState,
  SetDefaultFilterValue,
  SetResourceType,
  SetSortBy,
} from '@osf/shared/stores/global-search';

import { FiltersSectionComponent } from '../../components/filters-section/filters-section.component';

import { InstitutionsProjectsComponent } from './institutions-projects.component';

import {
  MOCK_ADMIN_INSTITUTIONS_INSTITUTION,
  MOCK_ADMIN_INSTITUTIONS_PROJECT_RESOURCE,
  MOCK_ADMIN_INSTITUTIONS_PROJECT_RESOURCES,
} from '@testing/mocks/admin-institutions.mock';
import { MOCK_USER } from '@testing/mocks/data.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

jest.mock('@osf/features/admin-institutions/helpers', () => ({
  downloadResults: jest.fn(),
  extractPathAfterDomain: jest.fn((url: string) => url.split('/').pop() || ''),
  INSTITUTIONS_CSV_TSV_FIELDS: {
    nodes: [
      'title',
      'dateCreated',
      'dateModified',
      'sameAs',
      'storageRegion.prefLabel',
      'storageByteCount',
      'creator.@id',
      'creator.name',
      'usage.viewCount',
      'resourceNature.displayLabel',
      'rights.name',
      'hasOsfAddon.prefLabel',
      'funder.name',
    ],
  },
  INSTITUTIONS_DOWNLOAD_CSV_TSV_RESOURCE: {
    nodes: {
      singular_upper: 'Project',
      plural_lower: 'projects',
    },
  },
}));

describe('InstitutionsProjectsComponent', () => {
  let component: InstitutionsProjectsComponent;
  let fixture: ComponentFixture<InstitutionsProjectsComponent>;
  let store: Store;
  let customDialogServiceMock: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let toastServiceMock: ReturnType<ToastServiceMockBuilder['build']>;

  const mockInstitution = { ...MOCK_ADMIN_INSTITUTIONS_INSTITUTION, id: 'inst-1' };
  const mockResource = MOCK_ADMIN_INSTITUTIONS_PROJECT_RESOURCE;
  const mockResources = MOCK_ADMIN_INSTITUTIONS_PROJECT_RESOURCES;

  beforeEach(async () => {
    customDialogServiceMock = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    toastServiceMock = ToastServiceMockBuilder.create().build();
    await TestBed.configureTestingModule({
      imports: [
        InstitutionsProjectsComponent,
        OSFTestingModule,
        ...MockComponents(AdminTableComponent, FiltersSectionComponent),
      ],
      providers: [
        MockProviders(Router),
        {
          provide: ActivatedRoute,
          useValue: { parent: { snapshot: { params: {} } }, snapshot: { queryParams: {} }, queryParams: of({}) },
        },
        MockProvider(CustomDialogService, customDialogServiceMock),
        MockProvider(ToastService, toastServiceMock),
        provideMockStore({
          signals: [
            { selector: InstitutionsAdminSelectors.getInstitution, value: mockInstitution },
            { selector: UserSelectors.getCurrentUser, value: MOCK_USER },
            { selector: GlobalSearchSelectors.getResources, value: mockResources },
            { selector: GlobalSearchSelectors.getResourcesCount, value: 1 },
            { selector: GlobalSearchSelectors.getResourcesLoading, value: false },
            { selector: GlobalSearchSelectors.getFirst, value: 'https://api.test.osf.io/v2/search/?page=1' },
            { selector: GlobalSearchSelectors.getNext, value: 'https://api.test.osf.io/v2/search/?page=2' },
            { selector: GlobalSearchSelectors.getPrevious, value: null },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsProjectsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.filtersVisible()).toBe(false);
    expect(component.sortField()).toBe('-dateModified');
    expect(component.sortOrder()).toBe(1);
    expect(component.tableColumns).toBeDefined();
  });

  it('should dispatch actions on ngOnInit', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(new SetResourceType(ResourceType.Project));
    expect(dispatchSpy).toHaveBeenCalledWith(new SetDefaultFilterValue('affiliation', mockInstitution.iris.join(',')));
    expect(dispatchSpy).toHaveBeenCalledWith(new FetchResources());
  });

  it('should dispatch ResetSearchState on ngOnDestroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.ngOnDestroy();

    expect(dispatchSpy).toHaveBeenCalledWith(new ResetSearchState());
  });

  it('should handle sort changes', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.onSortChange({
      searchValue: '',
      searchFields: [],
      sortColumn: 'title',
      sortOrder: SortOrder.Asc,
    });

    expect(component.sortField()).toBe('title');
    expect(component.sortOrder()).toBe(SortOrder.Asc);
    expect(dispatchSpy).toHaveBeenCalledWith(new SetSortBy('title'));
    expect(dispatchSpy).toHaveBeenCalledWith(new FetchResources());

    component.onSortChange({
      searchValue: '',
      searchFields: [],
      sortColumn: 'dateCreated',
      sortOrder: SortOrder.Desc,
    });

    expect(component.sortField()).toBe('dateCreated');
    expect(component.sortOrder()).toBe(SortOrder.Desc);
    expect(dispatchSpy).toHaveBeenCalledWith(new SetSortBy('-dateCreated'));
  });

  it('should use default sort values when params are missing', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    component.onSortChange({ searchValue: '', searchFields: [] } as unknown as SearchFilters);

    expect(component.sortField()).toBe('-dateModified');
    expect(component.sortOrder()).toBe(1);
    expect(dispatchSpy).toHaveBeenCalledWith(new SetSortBy('-dateModified'));
  });

  it('should dispatch FetchResourcesByLink on onLinkPageChange', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const link = 'https://api.test.osf.io/v2/search/?page=2';

    component.onLinkPageChange(link);

    expect(dispatchSpy).toHaveBeenCalledWith(new FetchResourcesByLink(link));
  });

  it('should call downloadResults for different file types', () => {
    const selfLink = 'https://api.test.osf.io/v2/search/';
    component.selfLink = signal(selfLink);

    [DownloadType.CSV, DownloadType.TSV, DownloadType.JSON].forEach((type) => {
      component.download(type);
      expect(downloadHelper.downloadResults).toHaveBeenCalledWith(
        selfLink,
        type,
        expect.any(Array),
        expect.any(Object)
      );
    });
  });

  it('should compute sortParam correctly', () => {
    component.sortField.set('title');
    component.sortOrder.set(SortOrder.Asc);
    expect(component.sortParam()).toBe('title');

    component.sortOrder.set(SortOrder.Desc);
    expect(component.sortParam()).toBe('-title');
  });

  it('should compute paginationLinks from selector values', () => {
    const links = component.paginationLinks();

    expect(links.first?.href).toBe('https://api.test.osf.io/v2/search/?page=1');
    expect(links.next?.href).toBe('https://api.test.osf.io/v2/search/?page=2');
    expect(links.prev?.href).toBe(null);
  });

  it('should compute tableData by mapping resources', () => {
    const tableData = component.tableData();

    expect(tableData).toHaveLength(1);
    expect(tableData[0]['title']).toBe(mockResource.title);
  });

  it('should handle onIconClick with sendMessage action', () => {
    const mockEvent: TableIconClickEvent = {
      action: 'sendMessage',
      rowData: {},
      arrayIndex: 0,
      column: {} as TableColumn,
    };

    const openContactDialogSpy = jest.spyOn(component as any, 'openContactDialog');

    component.onIconClick(mockEvent);

    expect(openContactDialogSpy).toHaveBeenCalledWith(mockEvent);
  });

  it('should ignore onIconClick with non-sendMessage action', () => {
    const mockEvent: TableIconClickEvent = {
      action: 'otherAction',
      rowData: {},
      arrayIndex: 0,
      column: {} as TableColumn,
    };

    const openContactDialogSpy = jest.spyOn(component as any, 'openContactDialog');

    component.onIconClick(mockEvent);

    expect(openContactDialogSpy).not.toHaveBeenCalled();
  });
});
