import { Store } from '@ngxs/store';

import { MockComponent } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@core/store/user';
import { AffiliatedInstitutionSelectComponent } from '@osf/shared/components/affiliated-institution-select/affiliated-institution-select.component';
import { ComponentFormControls } from '@osf/shared/enums/create-component-form-controls.enum';
import { ToastService } from '@osf/shared/services/toast.service';
import { FetchUserInstitutions, InstitutionsSelectors } from '@osf/shared/stores/institutions';
import { FetchRegions, RegionsSelectors } from '@osf/shared/stores/regions';

import { CreateComponent, GetComponents, ProjectOverviewSelectors } from '../../store';

import { AddComponentDialogComponent } from './add-component-dialog.component';

import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { MOCK_PROJECT } from '@testing/mocks/project.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('AddComponentDialogComponent', () => {
  let component: AddComponentDialogComponent;
  let fixture: ComponentFixture<AddComponentDialogComponent>;
  let store: Store;

  const mockRegions = [{ id: 'region-1', name: 'Region 1' }];
  const mockUser = { id: 'user-1', defaultRegionId: 'user-region' } as any;
  const mockProject = { ...MOCK_PROJECT, id: 'proj-1', title: 'Project', tags: ['tag1'] };
  const mockInstitutions = [MOCK_INSTITUTION];
  const mockUserInstitutions = [MOCK_INSTITUTION, { ...MOCK_INSTITUTION, id: 'inst-2', name: 'Inst 2' }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddComponentDialogComponent, OSFTestingModule, MockComponent(AffiliatedInstitutionSelectComponent)],
      providers: [
        provideMockStore({
          signals: [
            { selector: RegionsSelectors.getRegions, value: mockRegions },
            { selector: UserSelectors.getCurrentUser, value: mockUser },
            { selector: ProjectOverviewSelectors.getProject, value: mockProject },
            { selector: ProjectOverviewSelectors.getInstitutions, value: mockInstitutions },
            { selector: RegionsSelectors.areRegionsLoading, value: false },
            { selector: ProjectOverviewSelectors.getComponentsSubmitting, value: false },
            { selector: InstitutionsSelectors.getUserInstitutions, value: mockUserInstitutions },
            { selector: InstitutionsSelectors.areUserInstitutionsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddComponentDialogComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    (store.dispatch as jest.Mock).mockReturnValue(of(void 0));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.componentForm.get(ComponentFormControls.Title)?.value).toBe('');
    expect(Array.isArray(component.componentForm.get(ComponentFormControls.Affiliations)?.value)).toBe(true);
    expect(component.componentForm.get(ComponentFormControls.Description)?.value).toBe('');
    expect(component.componentForm.get(ComponentFormControls.AddContributors)?.value).toBe(false);
    expect(component.componentForm.get(ComponentFormControls.AddTags)?.value).toBe(false);
    expect(['', 'user-region']).toContain(component.componentForm.get(ComponentFormControls.StorageLocation)?.value);
  });

  it('should dispatch FetchRegions and FetchUserInstitutions on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(FetchRegions));
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(FetchUserInstitutions));
  });

  it('should return store values from selectors', () => {
    expect(component.storageLocations()).toEqual(mockRegions);
    expect(component.currentUser()).toEqual(mockUser);
    expect(component.currentProject()).toEqual(mockProject);
    expect(component.institutions()).toEqual(mockInstitutions);
    expect(component.areRegionsLoading()).toBe(false);
    expect(component.isSubmitting()).toBe(false);
    expect(component.userInstitutions()).toEqual(mockUserInstitutions);
    expect(component.areUserInstitutionsLoading()).toBe(false);
  });

  it('should set affiliations form control from selected institutions', () => {
    const institutions = [MOCK_INSTITUTION];
    component.setSelectedInstitutions(institutions);
    expect(component.componentForm.get(ComponentFormControls.Affiliations)?.value).toEqual([MOCK_INSTITUTION.id]);
  });

  it('should mark form as touched and not dispatch when submitForm with invalid form', () => {
    (store.dispatch as jest.Mock).mockClear();
    component.componentForm.get(ComponentFormControls.Title)?.setValue('');
    component.submitForm();
    expect(component.componentForm.touched).toBe(true);
    const createCalls = (store.dispatch as jest.Mock).mock.calls.filter((c) => c[0] instanceof CreateComponent);
    expect(createCalls.length).toBe(0);
  });

  it('should dispatch CreateComponent and on success close dialog, getComponents, showSuccess', () => {
    component.componentForm.get(ComponentFormControls.Title)?.setValue('New Component');
    component.componentForm.get(ComponentFormControls.StorageLocation)?.setValue('region-1');
    component.componentForm.get(ComponentFormControls.Affiliations)?.setValue([MOCK_INSTITUTION.id]);
    (store.dispatch as jest.Mock).mockClear();

    component.submitForm();

    expect(store.dispatch).toHaveBeenCalledWith(
      new CreateComponent(mockProject.id, 'New Component', '', [], 'region-1', [MOCK_INSTITUTION.id], false)
    );
    expect(component.dialogRef.close).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetComponents));
    expect(TestBed.inject(ToastService).showSuccess).toHaveBeenCalledWith(
      'project.overview.dialog.toast.addComponent.success'
    );
  });

  it('should pass project tags when addTags is true', () => {
    component.componentForm.get(ComponentFormControls.Title)?.setValue('With Tags');
    component.componentForm.get(ComponentFormControls.StorageLocation)?.setValue('region-1');
    component.componentForm.get(ComponentFormControls.Affiliations)?.setValue([]);
    component.componentForm.get(ComponentFormControls.AddTags)?.setValue(true);
    (store.dispatch as jest.Mock).mockClear();

    component.submitForm();

    expect(store.dispatch).toHaveBeenCalledWith(
      new CreateComponent(mockProject.id, 'With Tags', '', mockProject.tags, 'region-1', [], false)
    );
  });

  it('should set storage location to user default region when control empty and regions loaded', () => {
    fixture = TestBed.createComponent(AddComponentDialogComponent);
    component = fixture.componentInstance;
    component.componentForm.get(ComponentFormControls.StorageLocation)?.setValue('');
    fixture.detectChanges();
    expect(component.componentForm.get(ComponentFormControls.StorageLocation)?.value).toBe('user-region');
  });
});

describe('AddComponentDialogComponent when user has no default region', () => {
  let component: AddComponentDialogComponent;
  let fixture: ComponentFixture<AddComponentDialogComponent>;

  const mockRegions = [{ id: 'region-1', name: 'Region 1' }];
  const mockProject = { ...MOCK_PROJECT, id: 'proj-1', title: 'Project', tags: ['tag1'] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddComponentDialogComponent, OSFTestingModule, MockComponent(AffiliatedInstitutionSelectComponent)],
      providers: [
        provideMockStore({
          signals: [
            { selector: RegionsSelectors.getRegions, value: mockRegions },
            { selector: UserSelectors.getCurrentUser, value: null },
            { selector: ProjectOverviewSelectors.getProject, value: mockProject },
            { selector: ProjectOverviewSelectors.getInstitutions, value: [] },
            { selector: RegionsSelectors.areRegionsLoading, value: false },
            { selector: ProjectOverviewSelectors.getComponentsSubmitting, value: false },
            { selector: InstitutionsSelectors.getUserInstitutions, value: [] },
            { selector: InstitutionsSelectors.areUserInstitutionsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddComponentDialogComponent);
    component = fixture.componentInstance;
    component.componentForm.get(ComponentFormControls.StorageLocation)?.setValue('');
    fixture.detectChanges();
  });

  it('should set storage location to first region when control empty', () => {
    expect(component.componentForm.get(ComponentFormControls.StorageLocation)?.value).toBe('region-1');
  });
});
