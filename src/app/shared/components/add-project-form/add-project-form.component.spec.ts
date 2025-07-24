import { provideStore, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MY_PROJECTS_TABLE_PARAMS } from '@osf/core/constants/my-projects-table.constants';
import { ProjectFormControls } from '@osf/shared/enums/create-project-form-controls.enum';

import { AddProjectFormComponent } from './add-project-form.component';

import { InstitutionsState } from 'src/app/shared/stores/institutions';
import { CreateProject, GetMyProjects, MyResourcesState } from 'src/app/shared/stores/my-resources';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProjectFormComponent, MockPipe(TranslatePipe)],
      providers: [
        provideStore([MyResourcesState, InstitutionsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProvider(DynamicDialogRef, { close: jest.fn() }),
        MockProvider(TranslateService),
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    store.reset({ myProjects: { projects: mockProjects }, institutions: { userInstitutions: mockAffiliations } });

    fixture = TestBed.createComponent(AddProjectFormComponent);
    component = fixture.componentInstance;
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
    const affiliationsControl = component.projectForm.get(ProjectFormControls.Affiliations);
    expect(affiliationsControl?.value).toEqual(mockAffiliations.map((aff) => aff.id));
  });

  it('should select all affiliations when selectAllAffiliations is called', () => {
    component.removeAllAffiliations();
    component.selectAllAffiliations();
    expect(component.projectForm.get(ProjectFormControls.Affiliations)?.value).toEqual(
      mockAffiliations.map((aff) => aff.id)
    );
  });

  it('should remove all affiliations when removeAllAffiliations is called', () => {
    component.selectAllAffiliations();
    component.removeAllAffiliations();
    expect(component.projectForm.get(ProjectFormControls.Affiliations)?.value).toEqual([]);
  });

  it('should dispatch CreateProject action and close dialog on successful submission', () => {
    const formValue = {
      title: 'Test Project',
      description: 'Test Description',
      template: '1',
      storageLocation: 'us',
      affiliations: ['aff1', 'aff2'],
    };

    const store = TestBed.inject(Store);

    component.projectForm.patchValue(formValue);
    component.submitForm();

    const dispatchSpy = jest.spyOn(store, 'dispatch');

    const action = new CreateProject(
      formValue.title,
      formValue.description,
      formValue.template,
      formValue.storageLocation,
      formValue.affiliations
    );

    store.dispatch(action);
    expect(dispatchSpy).toHaveBeenCalledWith(action);
  });
});
