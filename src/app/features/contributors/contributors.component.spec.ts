import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { ContributorsTableComponent } from '@osf/shared/components/contributors/contributors-table/contributors-table.component';
import { RequestAccessTableComponent } from '@osf/shared/components/contributors/request-access-table/request-access-table.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { ViewOnlyTableComponent } from '@osf/shared/components/view-only-table/view-only-table.component';
import { ContributorPermission } from '@osf/shared/enums/contributors/contributor-permission.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';
import {
  ContributorsSelectors,
  GetAllContributors,
  LoadMoreContributors,
  ResetContributorsState,
  UpdateBibliographyFilter,
  UpdateContributorsSearchValue,
  UpdatePermissionFilter,
} from '@osf/shared/stores/contributors';
import { CurrentResourceSelectors, GetResourceDetails } from '@osf/shared/stores/current-resource';
import { ViewOnlyLinkSelectors } from '@osf/shared/stores/view-only-links';

import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMock, CustomDialogServiceMockType } from '@testing/providers/custom-dialog-provider.mock';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { ContributorsComponent } from './contributors.component';

describe('ContributorsComponent', () => {
  let component: ContributorsComponent;
  let fixture: ComponentFixture<ContributorsComponent>;
  let store: Store;
  let toastService: ToastServiceMockType;
  let customDialogService: CustomDialogServiceMockType;
  let customConfirmationService: CustomConfirmationServiceMockType;
  let mockRouter: RouterMockType;

  const defaultSignals: SignalOverride[] = [
    { selector: ViewOnlyLinkSelectors.getViewOnlyLinks, value: [] },
    {
      selector: CurrentResourceSelectors.getResourceDetails,
      value: { id: 'resource-id', title: 'Resource title', rootParentId: null, parent: null },
    },
    { selector: CurrentResourceSelectors.getResourceWithChildren, value: [] },
    { selector: ContributorsSelectors.getContributors, value: [] },
    { selector: ContributorsSelectors.getRequestAccessList, value: [] },
    { selector: ContributorsSelectors.areRequestAccessListLoading, value: false },
    { selector: ContributorsSelectors.isContributorsLoading, value: false },
    { selector: ContributorsSelectors.getContributorsTotalCount, value: 0 },
    { selector: ViewOnlyLinkSelectors.isViewOnlyLinksLoading, value: false },
    { selector: CurrentResourceSelectors.hasResourceAdminAccess, value: false },
    { selector: CurrentResourceSelectors.resourceAccessRequestEnabled, value: false },
    { selector: UserSelectors.getCurrentUser, value: { id: 'user-1' } },
    { selector: ContributorsSelectors.getContributorsPageSize, value: 10 },
    { selector: ContributorsSelectors.isContributorsLoadingMore, value: false },
  ];

  function setup(overrides: BaseSetupOverrides = {}) {
    const routeBuilder = ActivatedRouteMockBuilder.create().withData({ resourceType: ResourceType.Project });
    if (overrides.routeParams) {
      routeBuilder.withParams(overrides.routeParams);
    }
    if (overrides.hasParent === false) {
      routeBuilder.withNoParent();
    }
    const mockRoute = routeBuilder.build();

    mockRouter = RouterMockBuilder.create().build();
    toastService = ToastServiceMock.simple();
    customDialogService = CustomDialogServiceMock.simple();
    customConfirmationService = CustomConfirmationServiceMock.simple();
    const loaderService = new LoaderServiceMock();

    TestBed.configureTestingModule({
      imports: [
        ContributorsComponent,
        ...MockComponents(
          SearchInputComponent,
          ContributorsTableComponent,
          RequestAccessTableComponent,
          ViewOnlyTableComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, mockRoute),
        MockProvider(Router, mockRouter),
        MockProvider(ToastService, toastService),
        MockProvider(CustomDialogService, customDialogService),
        MockProvider(CustomConfirmationService, customConfirmationService),
        MockProvider(LoaderService, loaderService),
        provideMockStore({
          signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides),
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ContributorsComponent);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    setup({ routeParams: { id: 'resource-id' } });
    expect(component).toBeTruthy();
  });

  it('should dispatch resource and contributors actions on init', () => {
    setup({ routeParams: { id: 'resource-id' } });
    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(new GetResourceDetails('resource-id', ResourceType.Project));
    expect(store.dispatch).toHaveBeenCalledWith(new GetAllContributors('resource-id', ResourceType.Project));
  });

  it('should not dispatch init actions when resource id is missing', () => {
    setup();
    component.ngOnInit();

    expect(store.dispatch).not.toHaveBeenCalledWith(new GetResourceDetails('resource-id', ResourceType.Project));
    expect(store.dispatch).not.toHaveBeenCalledWith(new GetAllContributors('resource-id', ResourceType.Project));
  });

  it('should dispatch search update after debounce', () => {
    vi.useFakeTimers();
    setup({ routeParams: { id: 'resource-id' } });
    component.ngOnInit();
    (store.dispatch as Mock).mockClear();

    component.searchControl.setValue('john');
    vi.advanceTimersByTime(500);

    expect(store.dispatch).toHaveBeenCalledWith(new UpdateContributorsSearchValue('john'));
    vi.useRealTimers();
  });

  it('should dispatch permission and bibliography filter actions', () => {
    setup({ routeParams: { id: 'resource-id' } });
    (store.dispatch as Mock).mockClear();

    component.onPermissionChange(ContributorPermission.Admin);
    component.onBibliographyChange(true);

    expect(store.dispatch).toHaveBeenCalledWith(new UpdatePermissionFilter(ContributorPermission.Admin));
    expect(store.dispatch).toHaveBeenCalledWith(new UpdateBibliographyFilter(true));
  });

  it('should cancel edited contributors to initial state', () => {
    setup({
      routeParams: { id: 'resource-id' },
      selectorOverrides: [
        {
          selector: ContributorsSelectors.getContributors,
          value: [
            {
              id: 'c1',
              userId: 'u1',
              fullName: 'Jane Doe',
            },
          ],
        },
      ],
    });

    component.contributors.set([]);
    component.cancel();

    expect(component.contributors()).toEqual([
      {
        id: 'c1',
        userId: 'u1',
        fullName: 'Jane Doe',
      },
    ]);
  });

  it('should dispatch load more contributors action', () => {
    setup({ routeParams: { id: 'resource-id' } });
    (store.dispatch as Mock).mockClear();

    component.loadMoreContributors();

    expect(store.dispatch).toHaveBeenCalledWith(new LoadMoreContributors('resource-id', ResourceType.Project));
  });

  it('should dispatch bulk update and show success toast on save', () => {
    setup({
      routeParams: { id: 'resource-id' },
      selectorOverrides: [
        {
          selector: ContributorsSelectors.getContributors,
          value: [
            {
              id: 'c1',
              userId: 'u1',
              fullName: 'Jane Doe',
            },
          ],
        },
      ],
    });
    (store.dispatch as Mock).mockReturnValue(of(true));
    (store.dispatch as Mock).mockClear();

    component.save();

    expect(store.dispatch).toHaveBeenCalled();
    expect(toastService.showSuccess).toHaveBeenCalledWith(
      'project.contributors.toastMessages.multipleUpdateSuccessMessage'
    );
  });

  it('should dispatch reset action on destroy', () => {
    setup({ routeParams: { id: 'resource-id' } });
    (store.dispatch as Mock).mockClear();

    fixture.destroy();

    expect(store.dispatch).toHaveBeenCalledWith(new ResetContributorsState());
  });
});
