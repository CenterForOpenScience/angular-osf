import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsTableComponent } from '@osf/shared/components/contributors';
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
} from '@shared/stores/contributors';

import { PreprintsContributorsComponent } from './preprints-contributors.component';

import { MOCK_CONTRIBUTOR, MOCK_CONTRIBUTOR_ADD } from '@testing/mocks/contributors.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMock, CustomDialogServiceMockType } from '@testing/providers/custom-dialog-provider.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

describe('PreprintsContributorsComponent', () => {
  let component: PreprintsContributorsComponent;
  let fixture: ComponentFixture<PreprintsContributorsComponent>;
  let store: Store;
  let dialogMock: CustomDialogServiceMockType;
  let confirmationMock: CustomConfirmationServiceMockType;
  let toastMock: ToastServiceMockType;

  const mockContributors = [MOCK_CONTRIBUTOR];
  const preprintId = 'preprint-1';
  const defaultSignals: SignalOverride[] = [
    { selector: ContributorsSelectors.getContributors, value: mockContributors },
    { selector: ContributorsSelectors.isContributorsLoading, value: false },
    { selector: ContributorsSelectors.isContributorsLoadingMore, value: false },
    { selector: ContributorsSelectors.getContributorsPageSize, value: 10 },
    { selector: ContributorsSelectors.getContributorsTotalCount, value: 1 },
  ];

  function setup(overrides?: {
    preprintId?: string;
    selectorOverrides?: SignalOverride[];
    addDialogCloseValue?: unknown;
    addUnregisteredDialogCloseValue?: unknown;
  }) {
    const signals = mergeSignalOverrides(defaultSignals, overrides?.selectorOverrides);
    const addDialogClose$ = of(overrides?.addDialogCloseValue);
    const addUnregisteredDialogClose$ = of(overrides?.addUnregisteredDialogCloseValue);

    dialogMock = CustomDialogServiceMock.create()
      .withOpen(
        jest.fn((component: unknown) => {
          const isUnregisteredDialog =
            typeof component === 'function' && `${component}`.includes('AddUnregisteredContributorDialogComponent');
          return {
            onClose: isUnregisteredDialog ? addUnregisteredDialogClose$ : addDialogClose$,
          } as never;
        })
      )
      .build();
    confirmationMock = CustomConfirmationServiceMock.simple();
    toastMock = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [PreprintsContributorsComponent, MockComponent(ContributorsTableComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(CustomDialogService, dialogMock),
        MockProvider(CustomConfirmationService, confirmationMock),
        MockProvider(ToastService, toastMock),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(PreprintsContributorsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      'preprintId',
      overrides && 'preprintId' in overrides ? overrides.preprintId : preprintId
    );
    fixture.detectChanges();
  }

  afterEach(() => {
    fixture?.destroy();
    jest.restoreAllMocks();
  });

  it('should fetch contributors when preprint id exists', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new GetAllContributors(preprintId, ResourceType.Preprint));
  });

  it('should clone initial contributors into editable contributors', () => {
    setup();

    expect(component.contributors()).toEqual(mockContributors);
    expect(component.contributors()).not.toBe(mockContributors);
  });

  it('should compute hasChanges correctly', () => {
    setup();
    expect(component.hasChanges).toBe(false);

    component.contributors.set([{ ...MOCK_CONTRIBUTOR, fullName: 'Updated Name' }]);
    expect(component.hasChanges).toBe(true);

    component.contributors.set([]);
    expect(component.hasChanges).toBe(true);
  });

  it('should compute table params from selector values', () => {
    setup();

    expect(component.tableParams().totalRecords).toBe(1);
    expect(component.tableParams().rows).toBe(10);
    expect(component.tableParams().paginator).toBe(false);
    expect(component.tableParams().scrollable).toBe(true);
  });

  it('should reset contributors on cancel', () => {
    setup();
    component.contributors.set([{ ...MOCK_CONTRIBUTOR, fullName: 'Changed' }]);

    component.cancel();

    expect(component.contributors()).toEqual(mockContributors);
  });

  it('should save changed contributors and show success toast', () => {
    setup();
    component.contributors.set([{ ...MOCK_CONTRIBUTOR, fullName: 'Updated Name' }]);

    component.save();

    expect(store.dispatch).toHaveBeenCalledWith(
      new BulkUpdateContributors(preprintId, ResourceType.Preprint, [{ ...MOCK_CONTRIBUTOR, fullName: 'Updated Name' }])
    );
    expect(toastMock.showSuccess).toHaveBeenCalledWith(
      'project.contributors.toastMessages.multipleUpdateSuccessMessage'
    );
  });

  it('should open add contributor dialog', () => {
    setup();

    component.openAddContributorDialog();

    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should ignore empty add contributor dialog result', () => {
    setup({ addDialogCloseValue: null });

    component.openAddContributorDialog();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(BulkAddContributors));
  });

  it('should open unregistered dialog when add dialog returns unregistered type', () => {
    setup({
      addDialogCloseValue: { type: AddContributorType.Unregistered, data: [MOCK_CONTRIBUTOR_ADD] },
    });
    const openUnregisteredSpy = jest.spyOn(component, 'openAddUnregisteredContributorDialog');

    component.openAddContributorDialog();

    expect(openUnregisteredSpy).toHaveBeenCalled();
  });

  it('should add contributors when add dialog returns registered type', () => {
    setup({
      addDialogCloseValue: { type: AddContributorType.Registered, data: [MOCK_CONTRIBUTOR_ADD] },
    });

    component.openAddContributorDialog();

    expect(store.dispatch).toHaveBeenCalledWith(
      new BulkAddContributors(preprintId, ResourceType.Preprint, [MOCK_CONTRIBUTOR_ADD])
    );
    expect(toastMock.showSuccess).toHaveBeenCalledWith('project.contributors.toastMessages.multipleAddSuccessMessage');
  });

  it('should open registered dialog when unregistered dialog returns registered type', () => {
    setup({
      addUnregisteredDialogCloseValue: { type: AddContributorType.Registered, data: [MOCK_CONTRIBUTOR_ADD] },
    });
    const openRegisteredSpy = jest.spyOn(component, 'openAddContributorDialog');

    component.openAddUnregisteredContributorDialog();

    expect(openRegisteredSpy).toHaveBeenCalled();
  });

  it('should add unregistered contributor and show named toast', () => {
    setup({
      addUnregisteredDialogCloseValue: {
        type: AddContributorType.Unregistered,
        data: [{ ...MOCK_CONTRIBUTOR_ADD, fullName: 'Jane Doe' }],
      },
    });

    component.openAddUnregisteredContributorDialog();

    expect(store.dispatch).toHaveBeenCalledWith(
      new BulkAddContributors(preprintId, ResourceType.Preprint, [{ ...MOCK_CONTRIBUTOR_ADD, fullName: 'Jane Doe' }])
    );
    expect(toastMock.showSuccess).toHaveBeenCalledWith('project.contributors.toastMessages.addSuccessMessage', {
      name: 'Jane Doe',
    });
  });

  it('should open delete confirmation and delete contributor on confirm', () => {
    setup();

    component.removeContributor(MOCK_CONTRIBUTOR);

    expect(confirmationMock.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'project.contributors.removeDialog.title',
      messageKey: 'project.contributors.removeDialog.message',
      messageParams: { name: MOCK_CONTRIBUTOR.fullName },
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: expect.any(Function),
    });

    const { onConfirm } = confirmationMock.confirmDelete.mock.calls[0][0];
    onConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(
      new DeleteContributor(preprintId, ResourceType.Preprint, MOCK_CONTRIBUTOR.userId)
    );
    expect(toastMock.showSuccess).toHaveBeenCalledWith('project.contributors.removeDialog.successMessage', {
      name: MOCK_CONTRIBUTOR.fullName,
    });
  });

  it('should load more contributors', () => {
    setup({ preprintId });
    component.loadMoreContributors();
    expect(store.dispatch).toHaveBeenCalledWith(new LoadMoreContributors(preprintId, ResourceType.Preprint));
  });
});
