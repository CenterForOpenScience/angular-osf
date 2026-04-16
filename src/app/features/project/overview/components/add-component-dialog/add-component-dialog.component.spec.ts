import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@core/store/user';
import { AffiliatedInstitutionSelectComponent } from '@osf/shared/components/affiliated-institution-select/affiliated-institution-select.component';
import { ComponentFormControls } from '@osf/shared/enums/create-component-form-controls.enum';
import { IdNameModel } from '@osf/shared/models/common/id-name.model';
import { Institution } from '@osf/shared/models/institutions/institutions.model';
import { ToastService } from '@osf/shared/services/toast.service';
import { FetchUserInstitutions, InstitutionsSelectors } from '@osf/shared/stores/institutions';
import { FetchRegions, RegionsSelectors } from '@osf/shared/stores/regions';

import { MOCK_PROJECT_OVERVIEW } from '@testing/mocks/project-overview.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { ProjectOverviewModel } from '../../models';
import { CreateComponent, GetComponents, ProjectOverviewSelectors } from '../../store';

import { AddComponentDialogComponent } from './add-component-dialog.component';

describe('AddComponentDialogComponent', () => {
  let component: AddComponentDialogComponent;
  let fixture: ComponentFixture<AddComponentDialogComponent>;
  let store: Store;
  let dialogRef: DynamicDialogRef;
  let toastService: ToastServiceMockType;

  const mockProject: ProjectOverviewModel = {
    ...MOCK_PROJECT_OVERVIEW,
    id: 'project-1',
    title: 'Test Project',
    tags: ['tag-1', 'tag-2'],
  };

  const regions: IdNameModel[] = [
    { id: 'us', name: 'US' },
    { id: 'eu', name: 'EU' },
  ];

  const userInstitutions: Institution[] = [
    {
      id: 'inst-1',
      type: 'institutions',
      name: 'Institution 1',
      description: '',
      iri: '',
      rorIri: null,
      iris: [],
      assets: { logo: '', logo_rounded: '', banner: '' },
      institutionalRequestAccessEnabled: false,
      logoPath: '',
    },
    {
      id: 'inst-2',
      type: 'institutions',
      name: 'Institution 2',
      description: '',
      iri: '',
      rorIri: null,
      iris: [],
      assets: { logo: '', logo_rounded: '', banner: '' },
      institutionalRequestAccessEnabled: false,
      logoPath: '',
    },
  ];

  const projectInstitutions: Institution[] = [
    {
      id: 'inst-2',
      type: 'institutions',
      name: 'Institution 2',
      description: '',
      iri: '',
      rorIri: null,
      iris: [],
      assets: { logo: '', logo_rounded: '', banner: '' },
      institutionalRequestAccessEnabled: false,
      logoPath: '',
    },
  ];

  const defaultSignals: SignalOverride[] = [
    { selector: RegionsSelectors.getRegions, value: regions },
    { selector: RegionsSelectors.areRegionsLoading, value: false },
    { selector: UserSelectors.getCurrentUser, value: { id: 'user-1', defaultRegionId: 'eu' } },
    { selector: ProjectOverviewSelectors.getProject, value: mockProject },
    { selector: ProjectOverviewSelectors.getInstitutions, value: [] },
    { selector: ProjectOverviewSelectors.getComponentsSubmitting, value: false },
    { selector: InstitutionsSelectors.getUserInstitutions, value: [] },
    { selector: InstitutionsSelectors.areUserInstitutionsLoading, value: false },
  ];

  function setup(overrides: BaseSetupOverrides = {}) {
    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [AddComponentDialogComponent, ...MockComponents(AffiliatedInstitutionSelectComponent)],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(ToastService, toastService),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    dialogRef = TestBed.inject(DynamicDialogRef);
    fixture = TestBed.createComponent(AddComponentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should dispatch initial load actions on init', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new FetchRegions());
    expect(store.dispatch).toHaveBeenCalledWith(new FetchUserInstitutions());
  });

  it('should set storage location from current user default region', () => {
    setup();

    expect(component.componentForm.controls[ComponentFormControls.StorageLocation].value).toBe('eu');
  });

  it('should fallback to first region when current user has no default region', () => {
    setup({
      selectorOverrides: [{ selector: UserSelectors.getCurrentUser, value: { id: 'user-1', defaultRegionId: null } }],
    });

    expect(component.componentForm.controls[ComponentFormControls.StorageLocation].value).toBe('us');
  });

  it('should preselect matching project and user institutions', () => {
    setup({
      selectorOverrides: [
        { selector: ProjectOverviewSelectors.getInstitutions, value: projectInstitutions },
        { selector: InstitutionsSelectors.getUserInstitutions, value: userInstitutions },
      ],
    });

    expect(component.selectedInstitutions()).toEqual([userInstitutions[1]]);
    expect(component.componentForm.controls[ComponentFormControls.Affiliations].value).toEqual(['inst-2']);
  });

  it('should set affiliations ids when setSelectedInstitutions is called', () => {
    setup();

    component.setSelectedInstitutions(userInstitutions);

    expect(component.componentForm.controls[ComponentFormControls.Affiliations].value).toEqual(['inst-1', 'inst-2']);
  });

  it('should mark all controls touched and not dispatch create action when form is invalid', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.submitForm();

    expect(component.componentForm.touched).toBe(true);
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(CreateComponent));
  });

  it('should not dispatch create action when project is missing', () => {
    setup({
      selectorOverrides: [{ selector: ProjectOverviewSelectors.getProject, value: null }],
    });
    (store.dispatch as Mock).mockClear();
    component.componentForm.patchValue({
      [ComponentFormControls.Title]: 'My Component',
      [ComponentFormControls.StorageLocation]: 'us',
    });

    component.submitForm();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(CreateComponent));
  });

  it('should dispatch create with empty tags when addTags is false', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    component.componentForm.patchValue({
      [ComponentFormControls.Title]: 'My Component',
      [ComponentFormControls.Description]: 'Description',
      [ComponentFormControls.StorageLocation]: 'us',
      [ComponentFormControls.Affiliations]: ['inst-1'],
      [ComponentFormControls.AddContributors]: true,
      [ComponentFormControls.AddTags]: false,
    });

    component.submitForm();

    expect(store.dispatch).toHaveBeenCalledWith(
      new CreateComponent('project-1', 'My Component', 'Description', [], 'us', ['inst-1'], true)
    );
    expect(store.dispatch).toHaveBeenCalledWith(new GetComponents('project-1'));
    expect(dialogRef.close).toHaveBeenCalledWith();
    expect(toastService.showSuccess).toHaveBeenCalledWith('project.overview.dialog.toast.addComponent.success');
  });

  it('should dispatch create with project tags when addTags is true', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    component.componentForm.patchValue({
      [ComponentFormControls.Title]: 'My Component',
      [ComponentFormControls.Description]: '',
      [ComponentFormControls.StorageLocation]: 'us',
      [ComponentFormControls.Affiliations]: [],
      [ComponentFormControls.AddContributors]: false,
      [ComponentFormControls.AddTags]: true,
    });

    component.submitForm();

    expect(store.dispatch).toHaveBeenCalledWith(
      new CreateComponent('project-1', 'My Component', '', ['tag-1', 'tag-2'], 'us', [], false)
    );
  });
});
