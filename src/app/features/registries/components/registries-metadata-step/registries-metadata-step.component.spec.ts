import { Store } from '@ngxs/store';

import { MockComponents, MockModule, ngMocks } from 'ng-mocks';

import { TextareaModule } from 'primeng/textarea';

import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { ContributorsSelectors } from '@osf/shared/stores/contributors';
import { SubjectsSelectors } from '@osf/shared/stores/subjects';

import { ClearState, DeleteDraft, RegistriesSelectors, UpdateDraft, UpdateStepState } from '../../store';

import { RegistriesAffiliatedInstitutionComponent } from './registries-affiliated-institution/registries-affiliated-institution.component';
import { RegistriesContributorsComponent } from './registries-contributors/registries-contributors.component';
import { RegistriesLicenseComponent } from './registries-license/registries-license.component';
import { RegistriesSubjectsComponent } from './registries-subjects/registries-subjects.component';
import { RegistriesTagsComponent } from './registries-tags/registries-tags.component';
import { RegistriesMetadataStepComponent } from './registries-metadata-step.component';

import {
  CustomConfirmationServiceMock,
  MockCustomConfirmationServiceProvider,
} from '@testing/mocks/custom-confirmation.service.mock';
import { MOCK_DRAFT_REGISTRATION } from '@testing/mocks/draft-registration.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder, provideActivatedRouteMock } from '@testing/providers/route-provider.mock';
import { provideRouterMock, RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistriesMetadataStepComponent', () => {
  ngMocks.faster();

  let component: RegistriesMetadataStepComponent;
  let fixture: ComponentFixture<RegistriesMetadataStepComponent>;
  let store: Store;
  let mockRouter: RouterMockType;
  let stepsStateSignal: WritableSignal<{ invalid: boolean }[]>;

  const mockDraft = { ...MOCK_DRAFT_REGISTRATION, title: 'Test Title', description: 'Test Description' };

  beforeEach(() => {
    const mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'draft-1' }).build();
    mockRouter = RouterMockBuilder.create().withUrl('/registries/osf/draft/draft-1/metadata').build();
    stepsStateSignal = signal<{ invalid: boolean }[]>([{ invalid: true }]);

    TestBed.configureTestingModule({
      imports: [
        RegistriesMetadataStepComponent,
        MockModule(TextareaModule),
        ...MockComponents(
          TextInputComponent,
          RegistriesContributorsComponent,
          RegistriesSubjectsComponent,
          RegistriesTagsComponent,
          RegistriesLicenseComponent,
          RegistriesAffiliatedInstitutionComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        provideActivatedRouteMock(mockActivatedRoute),
        provideRouterMock(mockRouter),
        MockCustomConfirmationServiceProvider,
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getDraftRegistration, value: mockDraft },
            { selector: RegistriesSelectors.getStepsState, value: stepsStateSignal },
            { selector: RegistriesSelectors.hasDraftAdminAccess, value: true },
            { selector: ContributorsSelectors.getContributors, value: [] },
            { selector: SubjectsSelectors.getSelectedSubjects, value: [] },
          ],
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(RegistriesMetadataStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize metadataForm with required controls', () => {
    expect(component.metadataForm.get('title')).toBeTruthy();
    expect(component.metadataForm.get('description')).toBeTruthy();
    expect(component.metadataForm.get('contributors')).toBeTruthy();
    expect(component.metadataForm.get('subjects')).toBeTruthy();
    expect(component.metadataForm.get('tags')).toBeTruthy();
    expect(component.metadataForm.get('license.id')).toBeTruthy();
  });

  it('should have form invalid when title is empty', () => {
    component.metadataForm.patchValue({ title: '', description: 'Valid' });
    expect(component.metadataForm.get('title')?.valid).toBe(false);
  });

  it('should submit metadata and navigate to step 1', () => {
    component.metadataForm.patchValue({ title: 'New Title', description: 'New Desc' });
    (store.dispatch as jest.Mock).mockClear();

    component.submitMetadata();

    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateDraft('draft-1', { title: 'New Title', description: 'New Desc' })
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['../1'],
      expect.objectContaining({ onSameUrlNavigation: 'reload' })
    );
  });

  it('should trim title and description on submit', () => {
    component.metadataForm.patchValue({ title: '  Padded Title  ', description: '  Padded Desc  ' });
    (store.dispatch as jest.Mock).mockClear();

    component.submitMetadata();

    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateDraft('draft-1', { title: 'Padded Title', description: 'Padded Desc' })
    );
  });

  it('should call confirmDelete when deleteDraft is called', () => {
    component.deleteDraft();
    expect(CustomConfirmationServiceMock.confirmDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        headerKey: 'registries.deleteDraft',
        messageKey: 'registries.confirmDeleteDraft',
      })
    );
  });

  it('should set isDraftDeleted and navigate on deleteDraft confirm', () => {
    CustomConfirmationServiceMock.confirmDelete.mockImplementation(({ onConfirm }: any) => onConfirm());
    (store.dispatch as jest.Mock).mockClear();

    component.deleteDraft();

    expect(component.isDraftDeleted).toBe(true);
    expect(store.dispatch).toHaveBeenCalledWith(new DeleteDraft('draft-1'));
    expect(store.dispatch).toHaveBeenCalledWith(new ClearState());
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/registries/osf/new');
  });

  it('should skip updates on destroy when isDraftDeleted is true', () => {
    (store.dispatch as jest.Mock).mockClear();
    component.isDraftDeleted = true;
    component.ngOnDestroy();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should update step state on destroy when fields are unchanged', () => {
    component.metadataForm.patchValue({ title: 'Test Title', description: 'Test Description' });
    (store.dispatch as jest.Mock).mockClear();
    component.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(new UpdateStepState('0', expect.any(Boolean), true));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UpdateDraft));
  });

  it('should dispatch updateDraft on destroy when fields have changed', () => {
    component.metadataForm.patchValue({ title: 'Changed Title', description: 'Test Description' });
    (store.dispatch as jest.Mock).mockClear();
    component.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(new UpdateStepState('0', expect.any(Boolean), true));
    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateDraft('draft-1', expect.objectContaining({ title: 'Changed Title' }))
    );
  });

  it('should mark form as touched when step state is invalid on init', () => {
    expect(component.metadataForm.touched).toBe(true);
  });
});
