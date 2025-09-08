import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MY_PROJECTS_TABLE_PARAMS } from '@osf/shared/constants';
import { ProjectFormControls } from '@osf/shared/enums';
import { CreateProject, GetMyProjects } from '@osf/shared/stores';

import { CreateProjectDialogComponent } from './create-project-dialog.component';

import { OSFTestingModule, OSFTestingStoreModule } from '@testing/osf.testing.module';

describe('CreateProjectDialogComponent', () => {
  let component: CreateProjectDialogComponent;
  let fixture: ComponentFixture<CreateProjectDialogComponent>;
  let store: jest.Mocked<Store>;
  let dialogRef: { close: jest.Mock };

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
    await TestBed.configureTestingModule({
      imports: [CreateProjectDialogComponent, OSFTestingModule, OSFTestingStoreModule],
      providers: [MockProvider(DynamicDialogRef, { close: jest.fn() })],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProjectDialogComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(Store) as jest.Mocked<Store>;
    dialogRef = TestBed.inject(DynamicDialogRef) as unknown as { close: jest.Mock };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark all controls touched and not dispatch when form is invalid', () => {
    const markAllSpy = jest.spyOn(component.projectForm, 'markAllAsTouched');

    component.submitForm();

    expect(markAllSpy).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should submit, refresh list and close dialog when form is valid', () => {
    fillValidForm('Title', 'Desc', 'Tpl', 'Storage', ['a1']);

    store.dispatch.mockReturnValue(of(undefined));

    component.submitForm();

    expect(store.dispatch).toHaveBeenCalledWith(new CreateProject('Title', 'Desc', 'Tpl', 'Storage', ['a1']));
    expect(store.dispatch).toHaveBeenCalledWith(new GetMyProjects(1, MY_PROJECTS_TABLE_PARAMS.rows, {}));
    expect(dialogRef.close).toHaveBeenCalled();
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
