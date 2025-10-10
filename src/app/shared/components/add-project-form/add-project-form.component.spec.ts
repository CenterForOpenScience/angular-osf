import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UserSelectors } from '@core/store/user';
import { ProjectFormControls } from '@osf/shared/enums';
import { CustomValidators } from '@osf/shared/helpers';
import { MOCK_USER } from '@osf/shared/mocks';
import { ProjectForm } from '@osf/shared/models';
import { ProjectModel } from '@osf/shared/models/projects';
import { InstitutionsSelectors, ProjectsSelectors, RegionsSelectors } from '@osf/shared/stores';
import { AffiliatedInstitutionSelectComponent, ProjectSelectorComponent } from '@shared/components';

import { AddProjectFormComponent } from './add-project-form.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('AddProjectFormComponent', () => {
  let component: AddProjectFormComponent;
  let fixture: ComponentFixture<AddProjectFormComponent>;

  const createProjectForm = (): FormGroup<ProjectForm> => {
    return new FormGroup<ProjectForm>({
      [ProjectFormControls.Title]: new FormControl('', {
        nonNullable: true,
        validators: [CustomValidators.requiredTrimmed()],
      }),
      [ProjectFormControls.StorageLocation]: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      [ProjectFormControls.Affiliations]: new FormControl<string[]>([], {
        nonNullable: true,
      }),
      [ProjectFormControls.Description]: new FormControl('', {
        nonNullable: true,
      }),
      [ProjectFormControls.Template]: new FormControl('', {
        nonNullable: true,
      }),
    });
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddProjectFormComponent,
        OSFTestingModule,
        ...MockComponents(AffiliatedInstitutionSelectComponent, ProjectSelectorComponent),
      ],
      providers: [
        provideMockStore({
          signals: [
            {
              selector: UserSelectors.getCurrentUser,
              value: signal(MOCK_USER),
            },
            {
              selector: ProjectsSelectors.getProjects,
              value: signal([]),
            },
            {
              selector: ProjectsSelectors.getProjectsLoading,
              value: signal(false),
            },
            {
              selector: RegionsSelectors.getRegions,
              value: signal([]),
            },
            {
              selector: RegionsSelectors.areRegionsLoading,
              value: signal(false),
            },
            {
              selector: InstitutionsSelectors.getUserInstitutions,
              value: signal([]),
            },
            {
              selector: InstitutionsSelectors.areUserInstitutionsLoading,
              value: signal(false),
            },
          ],
        }),
        MockProvider(DynamicDialogRef, { close: jest.fn() }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProjectFormComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('projectForm', createProjectForm());

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update template when onTemplateChange is called with a project', () => {
    const mockProject: ProjectModel = { id: 'template1', title: 'Template Project' } as ProjectModel;
    const templateControl = component.projectForm().get(ProjectFormControls.Template);

    expect(templateControl?.value).toBe('');
    expect(component.selectedTemplate()).toBeNull();
    expect(component.hasTemplateSelected()).toBe(false);

    component.onTemplateChange(mockProject);

    expect(templateControl?.value).toBe('template1');
    expect(component.selectedTemplate()).toEqual(mockProject);
    expect(component.hasTemplateSelected()).toBe(true);
  });

  it('should not update template when onTemplateChange is called with null', () => {
    const templateControl = component.projectForm().get(ProjectFormControls.Template);
    const initialValue = templateControl?.value;

    component.onTemplateChange(null);

    expect(templateControl?.value).toBe(initialValue);
    expect(component.selectedTemplate()).toBeNull();
    expect(component.hasTemplateSelected()).toBe(false);
  });
});
