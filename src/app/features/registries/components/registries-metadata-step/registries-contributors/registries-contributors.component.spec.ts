import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { Subject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { UserSelectors } from '@core/store/user';
import { AddContributorType } from '@osf/shared/enums/contributors/add-contributor-type.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import {
  BulkAddContributors,
  BulkUpdateContributors,
  ContributorsSelectors,
  DeleteContributor,
  GetAllContributors,
  LoadMoreContributors,
  ResetContributorsState,
} from '@osf/shared/stores/contributors';
import { ContributorsTableComponent } from '@shared/components/contributors/contributors-table/contributors-table.component';
import { ContributorModel } from '@shared/models/contributors/contributor.model';
import { ContributorDialogAddModel } from '@shared/models/contributors/contributor-dialog-add.model';

import { RegistriesContributorsComponent } from './registries-contributors.component';

import {
  MOCK_CONTRIBUTOR,
  MOCK_CONTRIBUTOR_ADD,
  MOCK_CONTRIBUTOR_WITHOUT_HISTORY,
} from '@testing/mocks/contributors.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMockBuilder,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import {
  CustomDialogServiceMockBuilder,
  CustomDialogServiceMockType,
} from '@testing/providers/custom-dialog-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

describe('RegistriesContributorsComponent', () => {
  let component: RegistriesContributorsComponent;
  let fixture: ComponentFixture<RegistriesContributorsComponent>;
  let store: Store;
  let mockCustomDialogService: CustomDialogServiceMockType;
  let mockCustomConfirmationService: CustomConfirmationServiceMockType;
  let mockToast: ToastServiceMockType;

  const initialContributors: ContributorModel[] = [MOCK_CONTRIBUTOR, MOCK_CONTRIBUTOR_WITHOUT_HISTORY];

  beforeAll(() => {
    if (typeof (globalThis as any).structuredClone !== 'function') {
      Object.defineProperty(globalThis as any, 'structuredClone', {
        configurable: true,
        writable: true,
        value: (o: unknown) => JSON.parse(JSON.stringify(o)),
      });
    }
  });

  beforeEach(() => {
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    mockCustomConfirmationService = CustomConfirmationServiceMockBuilder.create().build();
    mockToast = ToastServiceMockBuilder.create().build();

    TestBed.configureTestingModule({
      imports: [RegistriesContributorsComponent, MockComponent(ContributorsTableComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(CustomDialogService, mockCustomDialogService),
        MockProvider(CustomConfirmationService, mockCustomConfirmationService),
        MockProvider(ToastService, mockToast),
        provideMockStore({
          signals: [
            { selector: UserSelectors.getCurrentUser, value: { id: MOCK_CONTRIBUTOR.userId } },
            { selector: ContributorsSelectors.getContributors, value: initialContributors },
            { selector: ContributorsSelectors.isContributorsLoading, value: false },
            { selector: ContributorsSelectors.getContributorsTotalCount, value: 2 },
            { selector: ContributorsSelectors.isContributorsLoadingMore, value: false },
            { selector: ContributorsSelectors.getContributorsPageSize, value: 10 },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(RegistriesContributorsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('control', new FormControl([]));
    fixture.componentRef.setInput('draftId', 'draft-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getContributors on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(new GetAllContributors('draft-1', ResourceType.DraftRegistration));
  });

  it('should cancel changes and reset local contributors', () => {
    component.contributors.set([{ ...MOCK_CONTRIBUTOR, id: 'changed' }]);
    component.cancel();
    expect(component.contributors()).toEqual(JSON.parse(JSON.stringify(initialContributors)));
  });

  it('should save changed contributors and show success toast', () => {
    const changedContributor = { ...MOCK_CONTRIBUTOR_WITHOUT_HISTORY, permission: MOCK_CONTRIBUTOR.permission };
    component.contributors.set([{ ...MOCK_CONTRIBUTOR }, changedContributor]);
    (store.dispatch as jest.Mock).mockClear();
    component.save();
    expect(store.dispatch).toHaveBeenCalledWith(
      new BulkUpdateContributors('draft-1', ResourceType.DraftRegistration, [changedContributor])
    );
    expect(mockToast.showSuccess).toHaveBeenCalledWith(
      'project.contributors.toastMessages.multipleUpdateSuccessMessage'
    );
  });

  it('should bulk add registered contributors and show toast when add dialog closes', () => {
    const dialogClose$ = new Subject<ContributorDialogAddModel>();
    mockCustomDialogService.open.mockReturnValue({ onClose: dialogClose$, close: jest.fn() } as any);
    (store.dispatch as jest.Mock).mockClear();

    component.openAddContributorDialog();
    dialogClose$.next({ type: AddContributorType.Registered, data: [MOCK_CONTRIBUTOR_ADD] });

    expect(store.dispatch).toHaveBeenCalledWith(
      new BulkAddContributors('draft-1', ResourceType.DraftRegistration, [MOCK_CONTRIBUTOR_ADD])
    );
    expect(mockToast.showSuccess).toHaveBeenCalledWith('project.contributors.toastMessages.multipleAddSuccessMessage');
  });

  it('should switch to unregistered dialog when add dialog closes with unregistered type', () => {
    const dialogClose$ = new Subject<ContributorDialogAddModel>();
    mockCustomDialogService.open.mockReturnValue({ onClose: dialogClose$, close: jest.fn() } as any);
    const spy = jest.spyOn(component, 'openAddUnregisteredContributorDialog').mockImplementation(() => {});

    component.openAddContributorDialog();
    dialogClose$.next({ type: AddContributorType.Unregistered, data: [] });

    expect(spy).toHaveBeenCalled();
  });

  it('should bulk add unregistered contributor and show toast with name param', () => {
    const dialogClose$ = new Subject<ContributorDialogAddModel>();
    const unregisteredAdd = { ...MOCK_CONTRIBUTOR_ADD, fullName: 'Test User' };
    mockCustomDialogService.open.mockReturnValue({ onClose: dialogClose$, close: jest.fn() } as any);
    (store.dispatch as jest.Mock).mockClear();

    component.openAddUnregisteredContributorDialog();
    dialogClose$.next({ type: AddContributorType.Unregistered, data: [unregisteredAdd] });

    expect(store.dispatch).toHaveBeenCalledWith(
      new BulkAddContributors('draft-1', ResourceType.DraftRegistration, [unregisteredAdd])
    );
    expect(mockToast.showSuccess).toHaveBeenCalledWith('project.contributors.toastMessages.addSuccessMessage', {
      name: 'Test User',
    });
  });

  it('should switch to registered dialog when unregistered dialog closes with registered type', () => {
    const dialogClose$ = new Subject<ContributorDialogAddModel>();
    mockCustomDialogService.open.mockReturnValue({ onClose: dialogClose$, close: jest.fn() } as any);
    const spy = jest.spyOn(component, 'openAddContributorDialog').mockImplementation(() => {});

    component.openAddUnregisteredContributorDialog();
    dialogClose$.next({ type: AddContributorType.Registered, data: [] });

    expect(spy).toHaveBeenCalled();
  });

  it('should remove contributor after confirmation and show success toast', () => {
    (store.dispatch as jest.Mock).mockClear();
    component.removeContributor(MOCK_CONTRIBUTOR_WITHOUT_HISTORY);
    expect(mockCustomConfirmationService.confirmDelete).toHaveBeenCalled();
    const call = (mockCustomConfirmationService.confirmDelete as jest.Mock).mock.calls[0][0];
    call.onConfirm();
    expect(store.dispatch).toHaveBeenCalledWith(
      new DeleteContributor('draft-1', ResourceType.DraftRegistration, MOCK_CONTRIBUTOR_WITHOUT_HISTORY.userId)
    );
    expect(mockToast.showSuccess).toHaveBeenCalledWith('project.contributors.removeDialog.successMessage', {
      name: MOCK_CONTRIBUTOR_WITHOUT_HISTORY.fullName,
    });
  });

  it('should return true for hasChanges when contributors differ from initial', () => {
    component.contributors.set([{ ...MOCK_CONTRIBUTOR, id: 'changed' }]);
    expect(component.hasChanges).toBe(true);
  });

  it('should return false for hasChanges when contributors match initial', () => {
    expect(component.hasChanges).toBe(false);
  });

  it('should dispatch resetContributorsState on destroy', () => {
    (store.dispatch as jest.Mock).mockClear();
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(new ResetContributorsState());
  });

  it('should dispatch loadMoreContributors', () => {
    (store.dispatch as jest.Mock).mockClear();
    component.loadMoreContributors();
    expect(store.dispatch).toHaveBeenCalledWith(new LoadMoreContributors('draft-1', ResourceType.DraftRegistration));
  });

  it('should mark control touched and dirty on focus out', () => {
    component.onFocusOut();
    expect(component.control().touched).toBe(true);
    expect(component.control().dirty).toBe(true);
  });
});
