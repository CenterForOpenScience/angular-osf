import { Store } from '@ngxs/store';

import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { Step, StepItem, StepPanel } from 'primeng/stepper';

import { Mock } from 'vitest';

import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCollectionSteps } from '@osf/features/collections/enums';
import { AddToCollectionSelectors, GetCollectionLicenses } from '@osf/features/collections/store/add-to-collection';
import { TagsInputComponent } from '@osf/shared/components/tags-input/tags-input.component';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { LicenseModel } from '@osf/shared/models/license/license.model';
import { InterpolatePipe } from '@osf/shared/pipes/interpolate.pipe';
import { ToastService } from '@osf/shared/services/toast.service';
import { CollectionsSelectors } from '@osf/shared/stores/collections';
import { GetAllContributors } from '@osf/shared/stores/contributors';
import { ClearProjects, ProjectsSelectors } from '@osf/shared/stores/projects';

import { MOCK_PROJECT } from '@testing/mocks/project.mock';
import { MOCK_PROVIDER } from '@testing/mocks/provider.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

import { ProjectMetadataStepComponent } from './project-metadata-step.component';

const MOCK_LICENSE: LicenseModel = {
  id: 'MIT',
  name: 'MIT License',
  requiredFields: [],
  url: '',
  text: '',
};

const MOCK_COLLECTION_PROVIDER = {
  ...MOCK_PROVIDER,
  licensesLink: 'https://api.osf.io/v2/providers/collections/1/licenses/',
  defaultLicenseId: null,
};

interface SetupOverrides extends BaseSetupOverrides {
  project?: typeof MOCK_PROJECT | null;
  licenses?: LicenseModel[];
  provider?: typeof MOCK_COLLECTION_PROVIDER | null;
}

describe('ProjectMetadataStepComponent', () => {
  let component: ProjectMetadataStepComponent;
  let fixture: ComponentFixture<ProjectMetadataStepComponent>;
  let store: Store;
  let licensesSignal: WritableSignal<LicenseModel[]>;

  function setup(overrides: SetupOverrides = {}) {
    const project = 'project' in overrides ? overrides.project! : MOCK_PROJECT;
    const licenses = overrides.licenses ?? [];
    const provider = 'provider' in overrides ? overrides.provider! : MOCK_COLLECTION_PROVIDER;
    const toastServiceMock = ToastServiceMockBuilder.create().build();

    licensesSignal = signal(licenses);

    const defaultSignals: SignalOverride[] = [
      { selector: ProjectsSelectors.getSelectedProject, value: project },
      { selector: CollectionsSelectors.getCollectionProvider, value: provider },
      { selector: AddToCollectionSelectors.getCollectionLicenses, value: licensesSignal },
      { selector: ProjectsSelectors.getSelectedProjectUpdateSubmitting, value: false },
    ];

    TestBed.configureTestingModule({
      imports: [
        ProjectMetadataStepComponent,
        ...MockComponents(TagsInputComponent, TextInputComponent, TruncatedTextComponent, StepPanel, Step, StepItem),
        MockPipe(InterpolatePipe),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ToastService, toastServiceMock),
        provideMockStore({
          signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides),
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ProjectMetadataStepComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('stepperActiveValue', 0);
    fixture.componentRef.setInput('targetStepValue', AddToCollectionSteps.ProjectMetadata);
    fixture.componentRef.setInput('isDisabled', false);
    fixture.detectChanges();
  }

  it('should create with required inputs', () => {
    setup();

    expect(component).toBeTruthy();
    expect(component.stepperActiveValue()).toBe(0);
    expect(component.targetStepValue()).toBe(AddToCollectionSteps.ProjectMetadata);
    expect(component.isDisabled()).toBe(false);
  });

  it('should dispatch GetCollectionLicenses with provider licensesLink when licenses are empty', () => {
    setup({ licenses: [] });

    expect(store.dispatch).toHaveBeenCalledWith(new GetCollectionLicenses(MOCK_COLLECTION_PROVIDER.licensesLink));
  });

  it('should not dispatch GetCollectionLicenses when licenses are already loaded', () => {
    setup({ licenses: [MOCK_LICENSE] });

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetCollectionLicenses));
  });

  it('should resolve projectLicense from collection licenses by project licenseId', () => {
    setup({ licenses: [MOCK_LICENSE] });

    expect(component.projectLicense()).toEqual(MOCK_LICENSE);
    expect(component.selectedLicense()).toEqual(MOCK_LICENSE);
  });

  it('should return null projectLicense when project is missing', () => {
    setup({ project: null, licenses: [MOCK_LICENSE] });

    expect(component.projectLicense()).toBeNull();
  });

  it('should update tags on handleTagsChange', () => {
    setup({ licenses: [MOCK_LICENSE] });

    component.handleTagsChange(['tag1', 'tag2']);

    expect(component.projectTags()).toEqual(['tag1', 'tag2']);
  });

  it('should restore project tags on discard changes', () => {
    setup({ licenses: [MOCK_LICENSE] });

    component.handleTagsChange(['changed']);
    component.handleDiscardChanges();

    expect(component.projectTags()).toEqual(MOCK_PROJECT.tags);
  });

  it('should emit stepChange on handleEditStep', () => {
    setup();
    const stepChangeSpy = vi.spyOn(component.stepChange, 'emit');

    component.handleEditStep();

    expect(stepChangeSpy).toHaveBeenCalledWith(AddToCollectionSteps.ProjectMetadata);
  });

  it('should select license from select change event', () => {
    setup({ licenses: [MOCK_LICENSE] });
    const otherLicense: LicenseModel = { ...MOCK_LICENSE, id: 'CC0', name: 'CC0' };

    component.handleSelectCollectionLicense({ value: otherLicense } as never);

    expect(component.selectedLicense()).toEqual(otherLicense);
  });

  it('should proceed to contributors step when metadata is unchanged', () => {
    setup({ licenses: [MOCK_LICENSE] });
    (store.dispatch as Mock).mockClear();
    const stepChangeSpy = vi.spyOn(component.stepChange, 'emit');
    const metadataSavedSpy = vi.spyOn(component.metadataSaved, 'emit');

    component.handleUpdateMetadata();

    expect(stepChangeSpy).toHaveBeenCalledWith(AddToCollectionSteps.ProjectContributors);
    expect(store.dispatch).toHaveBeenCalledWith(new GetAllContributors(MOCK_PROJECT.id, ResourceType.Project));
    expect(metadataSavedSpy).toHaveBeenCalled();
  });

  it('should not update metadata when project is missing', () => {
    setup({ project: null });
    (store.dispatch as Mock).mockClear();
    const stepChangeSpy = vi.spyOn(component.stepChange, 'emit');

    component.handleUpdateMetadata();

    expect(stepChangeSpy).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetAllContributors));
  });

  it('should dispatch ClearProjects on destroy', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    fixture.destroy();

    expect(store.dispatch).toHaveBeenCalledWith(new ClearProjects());
  });
});
