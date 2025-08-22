import { provideStore, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MY_PROJECTS_TABLE_PARAMS } from '@osf/shared/constants/my-projects-table.constants';
import { ProjectFormControls } from '@osf/shared/enums/create-project-form-controls.enum';
import { CustomValidators } from '@osf/shared/helpers';
import { ProjectForm } from '@osf/shared/models';
import { Project } from '@osf/shared/models/projects';
import { GetMyProjects, MyResourcesState } from '@osf/shared/stores';
import { AffiliatedInstitutionSelectComponent, ProjectSelectorComponent } from '@shared/components';
import { InstitutionsState } from '@shared/stores/institutions';
import { RegionsState } from '@shared/stores/regions';

import { AddProjectFormComponent } from './add-project-form.component';

describe('AddProjectFormComponent', () => {
  let component: AddProjectFormComponent;
  let fixture: ComponentFixture<AddProjectFormComponent>;
  let store: Store;

  const mockProjects = [
    { id: '1', title: 'Project 1' },
    { id: '2', title: 'Project 2' },
  ];

  const mockAffiliations = [
    { id: 'aff1', name: 'Affiliation 1', assets: { logo: 'logo1.png' } },
    { id: 'aff2', name: 'Affiliation 2', assets: { logo: 'logo2.png' } },
  ];

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

  const createMockStoreState = () => ({
    myResources: { projects: mockProjects, loading: false, error: null },
    institutions: { userInstitutions: mockAffiliations, loading: false, error: null },
    regions: { regions: { data: [], loading: false, error: null } },
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddProjectFormComponent,
        MockPipe(TranslatePipe),
        MockComponents(ProjectSelectorComponent, AffiliatedInstitutionSelectComponent),
      ],
      providers: [
        provideStore([MyResourcesState, InstitutionsState, RegionsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(DynamicDialogRef, { close: jest.fn() }),
        MockProvider(TranslateService),
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    store.reset(createMockStoreState());

    fixture = TestBed.createComponent(AddProjectFormComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('projectForm', createProjectForm());

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const action = new GetMyProjects(1, MY_PROJECTS_TABLE_PARAMS.rows, {});

    store.dispatch(action);
    expect(dispatchSpy).toHaveBeenCalledWith(action);
  });

  it('should update template when onTemplateChange is called with a project', () => {
    const mockProject: Project = { id: 'template1', title: 'Template Project' } as Project;
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
