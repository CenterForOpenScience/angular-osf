import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@osf/core/store/user';
import { MY_PROJECTS_TABLE_PARAMS } from '@osf/shared/constants';
import { ProjectFormControls } from '@osf/shared/enums';
import { MOCK_STORE } from '@osf/shared/mocks';
import { CreateProject, GetMyProjects, InstitutionsSelectors, MyResourcesSelectors } from '@osf/shared/stores';
import { ProjectsSelectors } from '@osf/shared/stores/projects/projects.selectors';

import { CreateProjectDialogComponent } from './create-project-dialog.component';

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
      if (selector === InstitutionsSelectors.getUserInstitutions) return () => [];
      if (selector === InstitutionsSelectors.areUserInstitutionsLoading) return () => false;
      if (selector === InstitutionsSelectors.getResourceInstitutions) return () => [];
      if (selector === InstitutionsSelectors.areResourceInstitutionsLoading) return () => false;
      if (selector === InstitutionsSelectors.areResourceInstitutionsSubmitting) return () => false;
      if (selector === ProjectsSelectors.getProjects) return () => [];
      if (selector === ProjectsSelectors.getProjectsLoading) return () => false;
      if (selector === UserSelectors.getCurrentUser) return () => null;
      return () => undefined;
    });

    await TestBed.configureTestingModule({
      imports: [CreateProjectDialogComponent, OSFTestingModule],
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

    component.submitForm();

    expect(MOCK_STORE.dispatch).toHaveBeenCalledWith(new CreateProject('Title', 'Desc', 'Tpl', 'Storage', ['a1']));
    expect(MOCK_STORE.dispatch).toHaveBeenCalledWith(new GetMyProjects(1, MY_PROJECTS_TABLE_PARAMS.rows, {}));
    expect((dialogRef as any).close).toHaveBeenCalled();
  });

  it('should invalidate title when only spaces provided', () => {
    fillValidForm('   ', 'Desc', 'Tpl', 'Storage', []);
    expect(component.projectForm.get(ProjectFormControls.Title)?.valid).toBe(false);
  });

  it('should be valid when required fields are set', () => {
    fillValidForm('Valid title', '', '', 'Storage', []);
    expect(component.projectForm.valid).toBe(true);
  });
});
