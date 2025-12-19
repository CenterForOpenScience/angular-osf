import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';
import { AdminTableComponent } from '@osf/features/admin-institutions/components';
import { DownloadType } from '@osf/features/admin-institutions/enums';
import { InstitutionsAdminSelectors } from '@osf/features/admin-institutions/store';
import { SelectComponent } from '@osf/shared/components/select/select.component';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { SortOrder } from '@shared/enums/sort-order.enum';
import { SearchFilters } from '@shared/models/search-filters.model';

import { InstitutionsUsersComponent } from './institutions-users.component';

import {
  MOCK_ADMIN_INSTITUTIONS_INSTITUTION_WITH_METRICS,
  MOCK_ADMIN_INSTITUTIONS_USERS,
} from '@testing/mocks/admin-institutions.mock';
import { MOCK_USER } from '@testing/mocks/data.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('InstitutionsUsersComponent', () => {
  let component: InstitutionsUsersComponent;
  let fixture: ComponentFixture<InstitutionsUsersComponent>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;

  beforeEach(async () => {
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();

    await TestBed.configureTestingModule({
      imports: [InstitutionsUsersComponent, ...MockComponents(AdminTableComponent, SelectComponent), OSFTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}) },
        },
        MockProvider(Router),
        MockProvider(ToastService),
        provideMockStore({
          signals: [
            {
              selector: InstitutionsAdminSelectors.getInstitution,
              value: MOCK_ADMIN_INSTITUTIONS_INSTITUTION_WITH_METRICS,
            },
            {
              selector: InstitutionsAdminSelectors.getUsers,
              value: MOCK_ADMIN_INSTITUTIONS_USERS,
            },
            {
              selector: InstitutionsAdminSelectors.getUsersTotalCount,
              value: 1,
            },
            {
              selector: InstitutionsAdminSelectors.getUsersLoading,
              value: false,
            },
            {
              selector: UserSelectors.getCurrentUser,
              value: MOCK_USER,
            },
          ],
        }),
        MockProvider(CustomDialogService, mockCustomDialogService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize signals with default values', () => {
    expect(component.currentPage()).toBe(1);
    expect(component.currentPageSize()).toBe(10);
    expect(component.first()).toBe(0);
    expect(component.selectedDepartment()).toBeNull();
    expect(component.hasOrcidFilter()).toBe(false);
    expect(component.sortField()).toBe('user_name');
    expect(component.sortOrder()).toBe(1);
  });

  it('should handle onPageChange correctly', () => {
    const paginatorState = { page: 2, first: 20, rows: 25 };

    component.onPageChange(paginatorState);

    expect(component.currentPage()).toBe(3);
    expect(component.first()).toBe(20);
    expect(component.currentPageSize()).toBe(25);
  });

  it('should handle onPageChange with undefined values', () => {
    const paginatorState = { page: undefined, first: undefined, rows: undefined };

    component.onPageChange(paginatorState);

    expect(component.currentPage()).toBe(1);
    expect(component.first()).toBe(0);
    expect(component.currentPageSize()).toBe(10);
  });

  it('should handle onDepartmentChange correctly', () => {
    component.onDepartmentChange('Computer Science');

    expect(component.selectedDepartment()).toBe('Computer Science');
    expect(component.currentPage()).toBe(1);
  });

  it('should handle onDepartmentChange with null value', () => {
    component.onDepartmentChange(null);

    expect(component.selectedDepartment()).toBeNull();
    expect(component.currentPage()).toBe(1);
  });

  it('should handle onOrcidFilterChange correctly', () => {
    component.onOrcidFilterChange(true);

    expect(component.hasOrcidFilter()).toBe(true);
    expect(component.currentPage()).toBe(1);
  });

  it('should handle onSortChange correctly', () => {
    const sortEvent: SearchFilters = {
      searchValue: '',
      searchFields: [],
      sortColumn: 'userName',
      sortOrder: SortOrder.Desc,
    };

    component.onSortChange(sortEvent);

    expect(component.sortField()).toBe('user_name');
    expect(component.sortOrder()).toBe(-1);
    expect(component.currentPage()).toBe(1);
  });

  it('should handle onSortChange with undefined values', () => {
    const sortEvent = { searchValue: '', searchFields: [], sortColumn: undefined, sortOrder: undefined } as any;

    component.onSortChange(sortEvent);

    expect(component.sortField()).toBe('user_name');
    expect(component.sortOrder()).toBe(-1);
    expect(component.currentPage()).toBe(1);
  });

  it('should handle onIconClick with sendMessage action', () => {
    const mockEvent = {
      action: 'sendMessage',
      rowData: { userLink: { text: 'user123', url: 'https://example.com' } } as any,
      arrayIndex: 0,
      column: {} as any,
    };

    const openSpy = jest.spyOn(mockCustomDialogService, 'open');

    component.onIconClick(mockEvent);

    expect(openSpy).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        header: 'adminInstitutions.institutionUsers.sendEmail',
        width: '448px',
        data: MOCK_USER.fullName,
      })
    );
  });

  it('should not handle onIconClick with other actions', () => {
    const mockEvent = {
      action: 'otherAction',
      rowData: {},
      arrayIndex: 0,
      column: {} as any,
    };

    const openSpy = jest.spyOn(mockCustomDialogService, 'open');

    component.onIconClick(mockEvent);

    expect(openSpy).not.toHaveBeenCalled();
  });

  it('should download data with correct URL', () => {
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation();

    component.download(DownloadType.CSV);

    expect(windowOpenSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://api.test.osf.io/v2/institutions/test/users/metrics/?format=csv&page%5Bsize%5D=10000'
      ),
      '_blank'
    );

    windowOpenSpy.mockRestore();
  });

  it('should not download if userMetricsUrl is not available', () => {
    const originalInstitution = component.institution();
    (component as any).institution = () => ({ ...originalInstitution, userMetricsUrl: undefined });

    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation();

    component.download(DownloadType.CSV);

    expect(windowOpenSpy).not.toHaveBeenCalled();

    windowOpenSpy.mockRestore();
    (component as any).institution = () => originalInstitution;
  });

  it('should build filters correctly', () => {
    component.selectedDepartment.set('Computer Science');
    component.hasOrcidFilter.set(true);

    const filters = (component as any).buildFilters();

    expect(filters).toEqual({
      'filter[department]': 'Computer Science',
      'filter[orcid_id][ne]': '',
    });
  });

  it('should build filters with only department', () => {
    component.selectedDepartment.set('Biology');
    component.hasOrcidFilter.set(false);

    const filters = (component as any).buildFilters();

    expect(filters).toEqual({
      'filter[department]': 'Biology',
    });
  });

  it('should build filters with only ORCID filter', () => {
    component.selectedDepartment.set(null);
    component.hasOrcidFilter.set(true);

    const filters = (component as any).buildFilters();

    expect(filters).toEqual({
      'filter[orcid_id][ne]': '',
    });
  });

  it('should build empty filters when no filters are set', () => {
    component.selectedDepartment.set(null);
    component.hasOrcidFilter.set(false);

    const filters = (component as any).buildFilters();

    expect(filters).toEqual({});
  });

  it('should compute tableData correctly', () => {
    const tableData = component.tableData();

    expect(tableData).toHaveLength(1);
    expect(tableData[0]).toEqual(
      expect.objectContaining({
        userLink: expect.any(Object),
        department: 'Computer Science',
      })
    );
  });

  it('should compute amountText correctly', () => {
    const amountText = component.amountText();

    expect(amountText).toContain('1');
    expect(amountText).toContain('admininstitutions.summary.totalusers');
  });
});
