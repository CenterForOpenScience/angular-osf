import { Store } from '@ngxs/store';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@core/store/user';
import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { ProjectFormControls } from '@osf/shared/enums/create-project-form-controls.enum';
import { InstitutionsSelectors } from '@osf/shared/stores/institutions';
import { CreateProject, GetMyProjects, MyResourcesSelectors } from '@osf/shared/stores/my-resources';
import { ProjectsSelectors } from '@osf/shared/stores/projects';
import { RegionsSelectors } from '@osf/shared/stores/regions';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';

import { CreateProjectDialogComponent } from './create-project-dialog.component';

interface SetupOverrides {
  selectorOverrides?: SignalOverride[];
  selectorSnapshotOverrides?: {
    selector: unknown;
    value: unknown;
  }[];
}

describe('CreateProjectDialogComponent', () => {
  let component: CreateProjectDialogComponent;
  let fixture: ComponentFixture<CreateProjectDialogComponent>;
  let store: Store;
  let dialogRef: DynamicDialogRef;

  const defaultSignals: SignalOverride[] = [
    { selector: MyResourcesSelectors.isProjectSubmitting, value: false },
    { selector: UserSelectors.getCurrentUser, value: { id: 'user-1', defaultRegionId: 'us' } },
    { selector: RegionsSelectors.getRegions, value: [] },
    { selector: RegionsSelectors.areRegionsLoading, value: false },
    { selector: InstitutionsSelectors.getUserInstitutions, value: [] },
    { selector: InstitutionsSelectors.areUserInstitutionsLoading, value: false },
    { selector: ProjectsSelectors.getProjects, value: [] },
    { selector: ProjectsSelectors.getProjectsLoading, value: false },
  ];
  const defaultSnapshotSelectors = [{ selector: MyResourcesSelectors.getProjects, value: [{ id: 'new-project-id' }] }];

  function setup(overrides: SetupOverrides = {}) {
    TestBed.configureTestingModule({
      imports: [CreateProjectDialogComponent],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        provideMockStore({
          selectors: [...defaultSnapshotSelectors, ...(overrides.selectorSnapshotOverrides ?? [])],
          signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides),
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(CreateProjectDialogComponent);
    component = fixture.componentInstance;
    dialogRef = component.dialogRef;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should initialize form with expected default values', () => {
    setup();

    expect(component.projectForm.getRawValue()).toEqual({
      title: '',
      storageLocation: 'us',
      affiliations: [],
      description: '',
      template: '',
    });
  });

  it('should mark form as touched and not dispatch when form is invalid', () => {
    setup();
    const markAllAsTouchedSpy = vi.spyOn(component.projectForm, 'markAllAsTouched');
    (store.dispatch as Mock).mockClear();

    component.submitForm();

    expect(component.projectForm.invalid).toBe(true);
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(CreateProject));
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should dispatch create project with form values', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    component.projectForm.patchValue({
      [ProjectFormControls.Title]: 'My Project',
      [ProjectFormControls.StorageLocation]: 'us',
      [ProjectFormControls.Description]: 'Description',
      [ProjectFormControls.Template]: 'template-id',
      [ProjectFormControls.Affiliations]: ['inst-1'],
    });

    component.submitForm();

    expect(store.dispatch).toHaveBeenCalledWith(
      new CreateProject('My Project', 'Description', 'template-id', 'us', ['inst-1'])
    );
  });

  it('should fetch projects and close dialog with new project after successful creation', () => {
    setup({
      selectorSnapshotOverrides: [
        { selector: MyResourcesSelectors.getProjects, value: [{ id: 'new-id', title: 'x' }] },
      ],
    });
    (store.dispatch as Mock).mockClear();
    component.projectForm.patchValue({
      [ProjectFormControls.Title]: 'My Project',
      [ProjectFormControls.StorageLocation]: 'eu',
      [ProjectFormControls.Description]: 'Description',
      [ProjectFormControls.Template]: '',
      [ProjectFormControls.Affiliations]: [],
    });

    component.submitForm();

    expect(store.dispatch).toHaveBeenCalledWith(new GetMyProjects(1, DEFAULT_TABLE_PARAMS.rows, {}));
    expect(dialogRef.close).toHaveBeenCalledWith({ project: { id: 'new-id', title: 'x' } });
  });
});
