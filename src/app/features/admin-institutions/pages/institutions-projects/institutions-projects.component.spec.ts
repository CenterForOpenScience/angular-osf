import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { of, Subject, throwError } from 'rxjs';

import { Mock } from 'vitest';

import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@core/store/user';
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

import {
  MOCK_ADMIN_INSTITUTIONS_INSTITUTION,
  MOCK_ADMIN_INSTITUTIONS_PROJECT_RESOURCE,
  MOCK_ADMIN_INSTITUTIONS_PROJECT_RESOURCES,
} from '@testing/mocks/admin-institutions.mock';
import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomDialogServiceMockBuilder,
  CustomDialogServiceMockType,
} from '@testing/providers/custom-dialog-provider.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { AdminTableComponent } from '../../components/admin-table/admin-table.component';
import { FiltersSectionComponent } from '../../components/filters-section/filters-section.component';
import { RequestAccessErrorDialogComponent } from '../../components/request-access-error-dialog/request-access-error-dialog.component';
import { ContactDialogComponent } from '../../dialogs';
import { ContactOption, DownloadType } from '../../enums';
import { ContactDialogData, TableIconClickEvent } from '../../models';
import { InstitutionsAdminSelectors, RequestProjectAccess, SendUserMessage } from '../../store';

import { InstitutionsProjectsComponent } from './institutions-projects.component';

interface SetupOverrides extends BaseSetupOverrides {
  openMock?: CustomDialogServiceMockType['open'];
}

describe('InstitutionsProjectsComponent', () => {
  let component: InstitutionsProjectsComponent;
  let fixture: ComponentFixture<InstitutionsProjectsComponent>;
  let store: Store;
  let dispatchMock: Mock;
  let mockCustomDialogService: CustomDialogServiceMockType;
  let toastService: ToastServiceMockType;

  const mockInstitution = { ...MOCK_ADMIN_INSTITUTIONS_INSTITUTION, id: 'inst-1' };

  function createDialogRef<T>(onClose$: Subject<T>): DynamicDialogRef {
    return {
      onClose: onClose$.asObservable(),
      close: vi.fn(),
    } as unknown as DynamicDialogRef;
  }

  function createIconClickEvent(): TableIconClickEvent {
    return {
      action: 'sendMessage',
      arrayIndex: 0,
      column: {
        field: 'creator',
        header: 'Creator',
      },
      rowData: {
        creator: [{ text: 'John Creator', url: 'https://osf.io/user-1' }],
        link: { text: 'project-1', url: 'https://osf.io/project-1' },
      },
    };
  }

  function setup(overrides: SetupOverrides = {}) {
    const defaultSignals = [
      { selector: InstitutionsAdminSelectors.getInstitution, value: mockInstitution },
      { selector: UserSelectors.getCurrentUser, value: MOCK_USER },
      { selector: GlobalSearchSelectors.getResources, value: MOCK_ADMIN_INSTITUTIONS_PROJECT_RESOURCES },
      { selector: GlobalSearchSelectors.getResourcesCount, value: 1 },
      { selector: GlobalSearchSelectors.getResourcesLoading, value: false },
      { selector: GlobalSearchSelectors.getFirst, value: 'https://api.test.osf.io/v2/search/?page=1' },
      { selector: GlobalSearchSelectors.getNext, value: 'https://api.test.osf.io/v2/search/?page=2' },
      { selector: GlobalSearchSelectors.getPrevious, value: null },
    ];

    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);
    const openMock = overrides.openMock ?? vi.fn().mockReturnValue(createDialogRef(new Subject<never>()));

    mockCustomDialogService = CustomDialogServiceMockBuilder.create().withOpen(openMock).build();
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [InstitutionsProjectsComponent, ...MockComponents(AdminTableComponent, FiltersSectionComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(CustomDialogService, mockCustomDialogService),
        MockProvider(ToastService, toastService),
        provideMockStore({ signals }),
      ],
    });

    fixture = TestBed.createComponent(InstitutionsProjectsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    dispatchMock = store.dispatch as Mock;
    fixture.detectChanges();

    return { component, fixture, store, dispatchMock, mockCustomDialogService, toastService };
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should dispatch actions on init', () => {
    setup();

    expect(dispatchMock).toHaveBeenCalledWith(new SetResourceType(ResourceType.Project));
    expect(dispatchMock).toHaveBeenCalledWith(new SetDefaultFilterValue('affiliation', mockInstitution.iris.join(',')));
    expect(dispatchMock).toHaveBeenCalledWith(new FetchResources());
  });

  it('should dispatch ResetSearchState on destroy', () => {
    setup();
    dispatchMock.mockClear();

    component.ngOnDestroy();

    expect(dispatchMock).toHaveBeenCalledWith(new ResetSearchState());
  });

  it('should dispatch sort and fetch on sort change', () => {
    setup();
    dispatchMock.mockClear();

    component.onSortChange({
      searchValue: '',
      searchFields: [],
      sortColumn: 'title',
      sortOrder: SortOrder.Asc,
    });

    expect(component.sortField()).toBe('title');
    expect(component.sortOrder()).toBe(SortOrder.Asc);
    expect(component.sortParam()).toBe('title');
    expect(dispatchMock).toHaveBeenCalledWith(new SetSortBy('title'));
    expect(dispatchMock).toHaveBeenCalledWith(new FetchResources());
  });

  it('should use default sort when sort params are missing', () => {
    setup();
    dispatchMock.mockClear();

    component.onSortChange({ searchValue: '', searchFields: [] } as unknown as SearchFilters);

    expect(component.sortField()).toBe('-dateModified');
    expect(component.sortOrder()).toBe(1);
    expect(component.sortParam()).toBe('-dateModified');
    expect(dispatchMock).toHaveBeenCalledWith(new SetSortBy('-dateModified'));
    expect(dispatchMock).toHaveBeenCalledWith(new FetchResources());
  });

  it('should dispatch FetchResourcesByLink on page change', () => {
    setup();
    dispatchMock.mockClear();
    const link = 'https://api.test.osf.io/v2/search/?page=2';

    component.onLinkPageChange(link);

    expect(dispatchMock).toHaveBeenCalledWith(new FetchResourcesByLink(link));
  });

  it('should call downloadResults for selected type', () => {
    setup();
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(vi.fn());

    component.download(DownloadType.CSV);

    expect(windowOpenSpy).toHaveBeenCalled();

    windowOpenSpy.mockRestore();
  });

  it('should compute pagination links from selectors', () => {
    setup();

    const links = component.paginationLinks();

    expect(links.first?.href).toBe('https://api.test.osf.io/v2/search/?page=1');
    expect(links.next?.href).toBe('https://api.test.osf.io/v2/search/?page=2');
    expect(links.prev?.href).toBe(null);
  });

  it('should map resources into table data', () => {
    setup();

    const tableData = component.tableData();

    expect(tableData).toHaveLength(1);
    expect(tableData[0]['title']).toBe(MOCK_ADMIN_INSTITUTIONS_PROJECT_RESOURCE.title);
  });

  it('should open the contact dialog for sendMessage actions', () => {
    setup();

    component.onIconClick(createIconClickEvent());

    expect(mockCustomDialogService.open).toHaveBeenCalledWith(
      ContactDialogComponent,
      expect.objectContaining({
        header: 'adminInstitutions.institutionUsers.sendEmail',
        width: '448px',
        data: {
          currentUserFullName: MOCK_USER.fullName,
          defaultContactData: undefined,
        },
      })
    );
  });

  it('should ignore icon clicks for unsupported actions', () => {
    setup();

    component.onIconClick({
      ...createIconClickEvent(),
      action: 'viewDetails',
    });

    expect(mockCustomDialogService.open).not.toHaveBeenCalled();
  });

  it('should send a user message after the contact dialog closes with send message data', () => {
    const contactDialogClose$ = new Subject<ContactDialogData>();
    setup({
      openMock: vi.fn().mockReturnValue(createDialogRef(contactDialogClose$)),
    });
    dispatchMock.mockClear();

    component.onIconClick(createIconClickEvent());
    contactDialogClose$.next({
      emailContent: 'Hello there',
      selectedOption: ContactOption.SendMessage,
      ccSender: true,
      allowReplyToSender: false,
    });

    expect(dispatchMock).toHaveBeenCalledWith(
      new SendUserMessage('user-1', mockInstitution.id, 'Hello there', true, false)
    );
    expect(toastService.showSuccess).toHaveBeenCalledWith('adminInstitutions.institutionUsers.messageSent');
  });

  it('should request project access after the contact dialog closes with access request data', () => {
    const contactDialogClose$ = new Subject<ContactDialogData>();
    setup({
      openMock: vi.fn().mockReturnValue(createDialogRef(contactDialogClose$)),
    });
    dispatchMock.mockClear();

    component.onIconClick(createIconClickEvent());
    contactDialogClose$.next({
      emailContent: 'Please grant access',
      selectedOption: ContactOption.RequestAccess,
      permission: 'read',
      ccSender: false,
      allowReplyToSender: true,
    });

    expect(dispatchMock).toHaveBeenCalledWith(
      new RequestProjectAccess({
        userId: 'user-1',
        projectId: 'project-1',
        institutionId: mockInstitution.id,
        permission: 'read',
        messageText: 'Please grant access',
        bccSender: false,
        replyTo: true,
      })
    );
    expect(toastService.showSuccess).toHaveBeenCalledWith('adminInstitutions.institutionUsers.requestSent');
  });

  it('should show the request access error dialog and reopen contact dialog as send message after a 403 error', () => {
    const contactDialogClose$ = new Subject<ContactDialogData>();
    const errorDialogClose$ = new Subject<boolean>();
    const reopenDialogClose$ = new Subject<ContactDialogData>();
    const openMock = vi
      .fn()
      .mockReturnValueOnce(createDialogRef(contactDialogClose$))
      .mockReturnValueOnce(createDialogRef(errorDialogClose$))
      .mockReturnValueOnce(createDialogRef(reopenDialogClose$));

    setup({ openMock });
    dispatchMock.mockClear();
    dispatchMock.mockImplementation((action: unknown) => {
      if (action instanceof RequestProjectAccess) {
        return throwError(() => new HttpErrorResponse({ status: 403 }));
      }

      return of(true);
    });

    component.onIconClick(createIconClickEvent());
    contactDialogClose$.next({
      emailContent: 'Please grant access',
      selectedOption: ContactOption.RequestAccess,
      permission: 'write',
      ccSender: true,
      allowReplyToSender: false,
    });
    errorDialogClose$.next(true);

    expect(mockCustomDialogService.open).toHaveBeenNthCalledWith(
      2,
      RequestAccessErrorDialogComponent,
      expect.objectContaining({
        header: 'adminInstitutions.requestAccessErrorDialog.title',
      })
    );
    expect(mockCustomDialogService.open).toHaveBeenNthCalledWith(
      3,
      ContactDialogComponent,
      expect.objectContaining({
        data: {
          currentUserFullName: MOCK_USER.fullName,
          defaultContactData: {
            emailContent: 'Please grant access',
            selectedOption: ContactOption.SendMessage,
            permission: 'write',
            ccSender: true,
            allowReplyToSender: false,
          },
        },
      })
    );
    expect(toastService.showSuccess).not.toHaveBeenCalled();
  });
});
