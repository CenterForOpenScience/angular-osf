import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistriesContributorsComponent } from '@osf/features/registries/components/registries-metadata-step/registries-contributors/registries-contributors.component';
import { RegistriesLicenseComponent } from '@osf/features/registries/components/registries-metadata-step/registries-license/registries-license.component';
import { RegistriesSubjectsComponent } from '@osf/features/registries/components/registries-metadata-step/registries-subjects/registries-subjects.component';
import { RegistriesTagsComponent } from '@osf/features/registries/components/registries-metadata-step/registries-tags/registries-tags.component';
import { RegistriesSelectors } from '@osf/features/registries/store';
import { CustomConfirmationService } from '@osf/shared/services';
import { ContributorsSelectors, InstitutionsSelectors, SubjectsSelectors } from '@osf/shared/stores';
import { TextInputComponent } from '@shared/components';

import { RegistriesMetadataStepComponent } from './registries-metadata-step.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe.skip('RegistriesMetadataStepComponent', () => {
  let component: RegistriesMetadataStepComponent;
  let fixture: ComponentFixture<RegistriesMetadataStepComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'draft-1' }).build();
    mockRouter = RouterMockBuilder.create().withUrl('/registries/osf/draft/draft-1/metadata').build();

    await TestBed.configureTestingModule({
      imports: [
        RegistriesMetadataStepComponent,
        OSFTestingModule,
        ...MockComponents(
          RegistriesContributorsComponent,
          RegistriesLicenseComponent,
          RegistriesSubjectsComponent,
          RegistriesTagsComponent,
          TextInputComponent
        ),
      ],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        MockProvider(CustomConfirmationService, { confirmDelete: jest.fn() }),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getStepsState, value: { 0: { invalid: false } } },
            { selector: ContributorsSelectors.getContributors, value: [] },
            { selector: SubjectsSelectors.getSelectedSubjects, value: [] },
            { selector: InstitutionsSelectors.getResourceInstitutions, value: [] },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesMetadataStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with draft data', () => {
    expect(component.metadataForm.value.title).toBe(' My Title ');
    expect(component.metadataForm.value.description).toBe(' Description ');
    expect(component.metadataForm.value.license).toEqual({ id: 'mit' });
  });

  it('should compute hasAdminAccess', () => {
    expect(component.hasAdminAccess()).toBe(true);
  });

  it('should submit metadata, trim values and navigate to first step', () => {
    const actionsMock = {
      updateDraft: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: jest.fn() }) }),
      deleteDraft: jest.fn(),
      clearState: jest.fn(),
      updateStepState: jest.fn(),
    } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });
    const navSpy = jest.spyOn(TestBed.inject(Router), 'navigate');

    component.submitMetadata();

    expect(actionsMock.updateDraft).toHaveBeenCalledWith('draft-1', {
      title: 'My Title',
      description: 'Description',
    });
    expect(navSpy).toHaveBeenCalledWith(['../1'], {
      relativeTo: TestBed.inject(ActivatedRoute),
      onSameUrlNavigation: 'reload',
    });
  });

  it('should delete draft on confirm and navigate to new registration', () => {
    const confirmService = TestBed.inject(CustomConfirmationService) as jest.Mocked<CustomConfirmationService> as any;
    const actionsMock = {
      deleteDraft: jest.fn().mockReturnValue({ subscribe: ({ next }: any) => next() }),
      clearState: jest.fn(),
    } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });
    const navSpy = jest.spyOn(TestBed.inject(Router), 'navigateByUrl');

    (confirmService.confirmDelete as jest.Mock).mockImplementation(({ onConfirm }) => onConfirm());

    component.deleteDraft();

    expect(actionsMock.clearState).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith('/registries/osf/new');
  });

  it('should update step state and draft on destroy if changed', () => {
    const actionsMock = {
      updateStepState: jest.fn(),
      updateDraft: jest.fn(),
    } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });

    component.metadataForm.patchValue({ title: 'Changed', description: 'Changed desc' });
    fixture.destroy();

    expect(actionsMock.updateStepState).toHaveBeenCalledWith('0', true, true);
    expect(actionsMock.updateDraft).toHaveBeenCalledWith('draft-1', { title: 'Changed', description: 'Changed desc' });
  });
});
