import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectFormComponent } from '@osf/shared/components/add-project-form/add-project-form.component';
import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { ProjectFormControls } from '@osf/shared/enums/create-project-form-controls.enum';
import { CreateProject, GetMyProjects, MyResourcesSelectors } from '@osf/shared/stores/my-resources';

import { CreateProjectDialogComponent } from './create-project-dialog.component';

import { MOCK_STORE } from '@testing/mocks/mock-store.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('CreateProjectDialogComponent', () => {
  let component: CreateProjectDialogComponent;
  let fixture: ComponentFixture<CreateProjectDialogComponent>;
  let store: Store;
  let dialogRef: DynamicDialogRef;

  const fillValidForm = (
    title = 'My Project',
    description = 'Some description',
    template = 'tmpl-1',
    storageLocation = 'osfstorage',
    affiliations: string[] = ['aff-1', 'aff-2']
  ) => {
    component.projectForm.patchValue({
      [ProjectFormControls.Title]: title,
      [ProjectFormControls.Description]: description,
      [ProjectFormControls.Template]: template,
      [ProjectFormControls.StorageLocation]: storageLocation,
      [ProjectFormControls.Affiliations]: affiliations,
    });
  };

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === MyResourcesSelectors.isProjectSubmitting) return () => false;
      return () => undefined;
    });

    await TestBed.configureTestingModule({
      imports: [CreateProjectDialogComponent, OSFTestingModule, MockComponent(AddProjectFormComponent)],
      providers: [MockProvider(Store, MOCK_STORE)],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProjectDialogComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark all controls touched and not dispatch when form is invalid', () => {
    const markAllSpy = jest.spyOn(component.projectForm, 'markAllAsTouched');

    (store.dispatch as unknown as jest.Mock).mockClear();

    component.submitForm();

    expect(markAllSpy).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should submit, refresh list and close dialog when form is valid', () => {
    fillValidForm('Title', 'Desc', 'Tpl', 'Storage', ['a1']);

    (MOCK_STORE.dispatch as jest.Mock).mockReturnValue(of(undefined));
    (MOCK_STORE.selectSnapshot as jest.Mock).mockReturnValue([{ id: 'new-project-id' }]);

    component.submitForm();

    expect(MOCK_STORE.dispatch).toHaveBeenCalledWith(new CreateProject('Title', 'Desc', 'Tpl', 'Storage', ['a1']));
    expect(MOCK_STORE.dispatch).toHaveBeenCalledWith(new GetMyProjects(1, DEFAULT_TABLE_PARAMS.rows, {}));
    expect((dialogRef as any).close).toHaveBeenCalledWith({ project: { id: 'new-project-id' } });
  });
});
