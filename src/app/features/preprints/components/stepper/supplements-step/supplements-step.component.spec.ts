import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SupplementOptions } from '@osf/features/preprints/enums';
import {
  ConnectProject,
  CreateNewProject,
  DisconnectProject,
  FetchAvailableProjects,
  FetchPreprintProject,
  PreprintStepperSelectors,
} from '@osf/features/preprints/store/preprint-stepper';
import { AddProjectFormComponent } from '@osf/shared/components/add-project-form/add-project-form.component';
import { ProjectFormControls } from '@osf/shared/enums/create-project-form-controls.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { SupplementsStepComponent } from './supplements-step.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

describe('SupplementsStepComponent', () => {
  let component: SupplementsStepComponent;
  let fixture: ComponentFixture<SupplementsStepComponent>;
  let store: Store;
  let toastMock: ToastServiceMockType;
  let confirmationMock: CustomConfirmationServiceMockType;
  const originalPointerEvent = (globalThis as unknown as { PointerEvent?: typeof Event }).PointerEvent;

  const defaultSignals: SignalOverride[] = [
    { selector: PreprintStepperSelectors.getPreprint, value: { ...PREPRINT_MOCK, nodeId: null } },
    { selector: PreprintStepperSelectors.isPreprintSubmitting, value: false },
    { selector: PreprintStepperSelectors.getAvailableProjects, value: [] },
    { selector: PreprintStepperSelectors.areAvailableProjectsLoading, value: false },
    { selector: PreprintStepperSelectors.getPreprintProject, value: null },
    { selector: PreprintStepperSelectors.isPreprintProjectLoading, value: false },
  ];

  function setup(overrides?: { selectorOverrides?: SignalOverride[]; detectChanges?: boolean }) {
    const signals = mergeSignalOverrides(defaultSignals, overrides?.selectorOverrides);
    toastMock = ToastServiceMock.simple();
    confirmationMock = CustomConfirmationServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [SupplementsStepComponent, MockComponent(AddProjectFormComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(ToastService, toastMock),
        MockProvider(CustomConfirmationService, confirmationMock),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(SupplementsStepComponent);
    component = fixture.componentInstance;
    if (overrides?.detectChanges ?? true) {
      fixture.detectChanges();
    }
  }

  beforeAll(() => {
    if (!(globalThis as unknown as { PointerEvent?: typeof Event }).PointerEvent) {
      (globalThis as unknown as { PointerEvent: typeof Event }).PointerEvent = MouseEvent as unknown as typeof Event;
    }
  });

  afterEach(() => {
    fixture?.destroy();
    jest.restoreAllMocks();
  });

  afterAll(() => {
    if (originalPointerEvent) {
      (globalThis as unknown as { PointerEvent: typeof Event }).PointerEvent = originalPointerEvent;
    } else {
      delete (globalThis as unknown as { PointerEvent?: typeof Event }).PointerEvent;
    }
  });

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should fetch preprint project in constructor effect when node id exists and differs from selected project', () => {
    setup({
      selectorOverrides: [
        { selector: PreprintStepperSelectors.getPreprint, value: { ...PREPRINT_MOCK, nodeId: 'node-1' } },
        { selector: PreprintStepperSelectors.getPreprintProject, value: { id: 'project-1', name: 'Test Project' } },
      ],
    });

    expect(store.dispatch).toHaveBeenCalledWith(new FetchPreprintProject());
  });

  it('should skip preprint project fetch when node id matches selected project id', () => {
    setup({
      selectorOverrides: [
        { selector: PreprintStepperSelectors.getPreprint, value: { ...PREPRINT_MOCK, nodeId: 'node-1' } },
        { selector: PreprintStepperSelectors.getPreprintProject, value: { id: 'node-1', name: 'Node Project' } },
      ],
    });

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchPreprintProject));
  });

  it('should skip preprint project fetch when node id is absent', () => {
    setup({
      selectorOverrides: [
        { selector: PreprintStepperSelectors.getPreprint, value: { ...PREPRINT_MOCK, nodeId: null } },
      ],
    });

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchPreprintProject));
  });

  it('should dispatch available projects from debounced project search', fakeAsync(() => {
    setup();
    (store.dispatch as jest.Mock).mockClear();

    component.projectNameControl.setValue('search-query');
    tick(500);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(new FetchAvailableProjects('search-query'));
  }));

  it('should not dispatch before the debounce window elapses', fakeAsync(() => {
    setup();
    (store.dispatch as jest.Mock).mockClear();

    component.projectNameControl.setValue('search-query');
    tick(300);

    expect(store.dispatch).not.toHaveBeenCalledWith(new FetchAvailableProjects('search-query'));
    tick(200);
  }));

  it('should skip available projects dispatch when value equals selected project id', fakeAsync(() => {
    setup();
    (store.dispatch as jest.Mock).mockClear();
    component.selectedProjectId.set('project-1');

    component.projectNameControl.setValue('project-1');
    tick(500);

    expect(store.dispatch).not.toHaveBeenCalledWith(new FetchAvailableProjects('project-1'));
  }));

  it('should select supplement option and reset create form for create-new option', () => {
    setup({ detectChanges: false });
    component.createProjectForm.patchValue({
      [ProjectFormControls.Title]: 'Project',
      [ProjectFormControls.StorageLocation]: 'region-1',
    });

    component.selectSupplementOption(SupplementOptions.CreateNewProject);

    expect(component.selectedSupplementOption()).toBe(SupplementOptions.CreateNewProject);
    expect(component.createProjectForm.controls.title.value).toBe('');
    expect(component.createProjectForm.controls.storageLocation.value).toBe('');
    expect(store.dispatch).toHaveBeenCalledWith(new FetchAvailableProjects(null));
  });

  it('should select supplement option without resetting form for connect-existing option', () => {
    setup({ detectChanges: false });
    component.createProjectForm.patchValue({ [ProjectFormControls.Title]: 'Keep me' });

    component.selectSupplementOption(SupplementOptions.ConnectExistingProject);

    expect(component.selectedSupplementOption()).toBe(SupplementOptions.ConnectExistingProject);
    expect(component.createProjectForm.controls.title.value).toBe('Keep me');
  });

  it('should dispatch connect project and show success toast on project selection', () => {
    setup({ detectChanges: false });

    component.selectProject({
      value: 'project-1',
      originalEvent: new PointerEvent('click'),
    } as never);

    expect(component.selectedProjectId()).toBe('project-1');
    expect(store.dispatch).toHaveBeenCalledWith(new ConnectProject('project-1'));
    expect(toastMock.showSuccess).toHaveBeenCalledWith(
      'preprints.preprintStepper.supplements.successMessages.projectConnected'
    );
  });

  it('should return early in selectProject when event is not pointer event', () => {
    setup({ detectChanges: false });

    component.selectProject({
      value: 'project-1',
      originalEvent: new Event('change'),
    } as never);

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(ConnectProject));
    expect(toastMock.showSuccess).not.toHaveBeenCalled();
  });

  it('should disconnect project on confirmation and show success toast', () => {
    setup({ detectChanges: false });
    component.selectedProjectId.set('project-1');

    component.disconnectProject();

    expect(confirmationMock.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'preprints.preprintStepper.supplements.disconnectProject.header',
      messageKey: 'preprints.preprintStepper.supplements.disconnectProject.message',
      onConfirm: expect.any(Function),
    });

    const { onConfirm } = confirmationMock.confirmDelete.mock.calls[0][0];
    onConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(new DisconnectProject());
    expect(component.selectedProjectId()).toBeNull();
    expect(toastMock.showSuccess).toHaveBeenCalledWith(
      'preprints.preprintStepper.supplements.successMessages.projectDisconnected'
    );
  });

  it('should not dispatch disconnect or clear selection when disconnect is cancelled', () => {
    setup({ detectChanges: false });
    component.selectedProjectId.set('project-1');

    component.disconnectProject();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(DisconnectProject));
    expect(component.selectedProjectId()).toBe('project-1');
    expect(toastMock.showSuccess).not.toHaveBeenCalled();
  });

  it('should return early when create project form is invalid', () => {
    setup({ detectChanges: false });
    const emitSpy = jest.spyOn(component.nextClicked, 'emit');

    component.submitCreateProjectForm();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(CreateNewProject));
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should create project, show success and emit next when form is valid', () => {
    setup({ detectChanges: false });
    const emitSpy = jest.spyOn(component.nextClicked, 'emit');
    component.createProjectForm.patchValue({
      [ProjectFormControls.Title]: 'New Project',
      [ProjectFormControls.StorageLocation]: 'region-1',
      [ProjectFormControls.Affiliations]: ['inst-1'],
      [ProjectFormControls.Description]: 'Description',
      [ProjectFormControls.Template]: 'template-id',
    });

    component.submitCreateProjectForm();

    expect(store.dispatch).toHaveBeenCalledWith(
      new CreateNewProject('New Project', 'Description', 'template-id', 'region-1', ['inst-1'])
    );
    expect(toastMock.showSuccess).toHaveBeenCalledWith(
      'preprints.preprintStepper.supplements.successMessages.projectCreated'
    );
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should submit create project form path in nextButtonClicked for create-new option', () => {
    setup({ detectChanges: false });
    const createSpy = jest.spyOn(component, 'submitCreateProjectForm');
    component.selectedSupplementOption.set(SupplementOptions.CreateNewProject);

    component.nextButtonClicked();

    expect(createSpy).toHaveBeenCalled();
  });

  it('should emit next and show saved toast in nextButtonClicked for non-create option', () => {
    setup({ detectChanges: false });
    const emitSpy = jest.spyOn(component.nextClicked, 'emit');
    component.selectedSupplementOption.set(SupplementOptions.ConnectExistingProject);

    component.nextButtonClicked();

    expect(toastMock.showSuccess).toHaveBeenCalledWith(
      'preprints.preprintStepper.common.successMessages.preprintSaved'
    );
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should handle discard-changes confirmation callbacks in backButtonClicked', () => {
    setup({ detectChanges: false });
    const emitSpy = jest.spyOn(component.backClicked, 'emit');
    component.selectedSupplementOption.set(SupplementOptions.CreateNewProject);
    component.createProjectForm.patchValue({ [ProjectFormControls.Title]: 'Has data' });

    component.backButtonClicked();

    expect(confirmationMock.confirmContinue).toHaveBeenCalledWith({
      headerKey: 'preprints.preprintStepper.supplements.discardChanges.header',
      messageKey: 'preprints.preprintStepper.supplements.discardChanges.message',
      onConfirm: expect.any(Function),
      onReject: expect.any(Function),
    });

    const { onReject } = confirmationMock.confirmContinue.mock.calls[0][0];
    onReject();
    expect(emitSpy).not.toHaveBeenCalled();

    const { onConfirm } = confirmationMock.confirmContinue.mock.calls[0][0];
    onConfirm();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should emit back immediately in backButtonClicked when no create form data', () => {
    setup({ detectChanges: false });
    const emitSpy = jest.spyOn(component.backClicked, 'emit');

    component.backButtonClicked();

    expect(emitSpy).toHaveBeenCalled();
    expect(confirmationMock.confirmContinue).not.toHaveBeenCalled();
  });

  it('should compute next button disabled state for create and connect options', () => {
    setup({ detectChanges: false });
    component.selectedSupplementOption.set(SupplementOptions.CreateNewProject);
    expect(component.isNextButtonDisabled()).toBe(true);

    component.createProjectForm.patchValue({
      [ProjectFormControls.Title]: 'Valid title',
      [ProjectFormControls.StorageLocation]: 'region-1',
    });
    expect(component.isNextButtonDisabled()).toBe(false);
    component.selectedSupplementOption.set(SupplementOptions.ConnectExistingProject);
    expect(component.isNextButtonDisabled()).toBe(false);
  });
});
