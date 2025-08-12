import { provideStore, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MY_PROJECTS_TABLE_PARAMS } from '@osf/core/constants/my-projects-table.constants';
import { ProjectFormControls } from '@osf/shared/enums/create-project-form-controls.enum';
import { IdName, ProjectForm } from '@osf/shared/models';
import { GetMyProjects, InstitutionsState, MyResourcesState } from '@osf/shared/stores';
import { CustomValidators } from '@osf/shared/utils';
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

  const mockTemplates: IdName[] = [
    { id: '1', name: 'Template 1' },
    { id: '2', name: 'Template 2' },
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
      imports: [AddProjectFormComponent, MockPipe(TranslatePipe)],
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

    fixture.componentRef.setInput('templates', mockTemplates);
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

  it('should select all affiliations on init', () => {
    const affiliationsControl = component.projectForm().get(ProjectFormControls.Affiliations);
    expect(affiliationsControl?.value).toEqual(mockAffiliations.map((aff) => aff.id));
  });

  it('should select all affiliations when selectAllAffiliations is called', () => {
    component.removeAllAffiliations();
    component.selectAllAffiliations();
    expect(component.projectForm().get(ProjectFormControls.Affiliations)?.value).toEqual(
      mockAffiliations.map((aff) => aff.id)
    );
  });

  it('should remove all affiliations when removeAllAffiliations is called', () => {
    component.selectAllAffiliations();
    component.removeAllAffiliations();
    expect(component.projectForm().get(ProjectFormControls.Affiliations)?.value).toEqual([]);
  });
});
