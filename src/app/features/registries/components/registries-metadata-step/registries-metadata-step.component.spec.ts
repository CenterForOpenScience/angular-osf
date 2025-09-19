import { Store } from '@ngxs/store';

import { MockComponent, MockProvider } from 'ng-mocks';

import { ConfirmationService, MessageService } from 'primeng/api';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RegistriesSelectors } from '@osf/features/registries/store';
import { TextInputComponent } from '@osf/shared/components';
import { MOCK_STORE } from '@osf/shared/mocks';
import { ContributorsSelectors, SubjectsSelectors } from '@osf/shared/stores';

import { RegistriesContributorsComponent } from './registries-contributors/registries-contributors.component';
import { RegistriesLicenseComponent } from './registries-license/registries-license.component';
import { RegistriesSubjectsComponent } from './registries-subjects/registries-subjects.component';
import { RegistriesTagsComponent } from './registries-tags/registries-tags.component';
import { RegistriesMetadataStepComponent } from './registries-metadata-step.component';

import { MOCK_DRAFT_REGISTRATION } from '@testing/mocks/draft-registration.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('RegistriesMetadataStepComponent', () => {
  let component: RegistriesMetadataStepComponent;
  let fixture: ComponentFixture<RegistriesMetadataStepComponent>;
  const mockRoute = {
    snapshot: {
      params: of({ id: 'someId' }),
    },
    params: of(''),
  };

  beforeEach(async () => {
    MOCK_STORE.selectSignal.mockImplementation((selector) => {
      switch (selector) {
        case RegistriesSelectors.getDraftRegistration:
          return () => MOCK_DRAFT_REGISTRATION;
        case RegistriesSelectors.getStepsValidation:
          return () => [];
        case ContributorsSelectors.getContributors:
          return () => [];
        case SubjectsSelectors.getSelectedSubjects:
          return () => [];
      }
      return null;
    });
    await TestBed.configureTestingModule({
      imports: [
        OSFTestingModule,
        ReactiveFormsModule,
        RegistriesMetadataStepComponent,
        MockComponent(RegistriesContributorsComponent),
        MockComponent(RegistriesLicenseComponent),
        MockComponent(RegistriesSubjectsComponent),
        MockComponent(RegistriesTagsComponent),
        MockComponent(TextInputComponent),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        MockProvider(ConfirmationService),
        MockProvider(MessageService),
        MockProvider(Store, MOCK_STORE),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesMetadataStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with submission form', () => {
    const titleSection = fixture.nativeElement.querySelector('[data-test-registration-title-section]');
    const descriptionSection = fixture.nativeElement.querySelector('[data-test-registration-description-section]');
    const contributorsSection = fixture.nativeElement.querySelector('[data-test-registration-contributors-section]');
    const subjectsSection = fixture.nativeElement.querySelector('[data-test-registration-subjects-section]');
    const tagsSection = fixture.nativeElement.querySelector('[data-test-registration-tags-section]');
    expect(titleSection).toBeDefined();
    expect(descriptionSection).toBeDefined();
    expect(contributorsSection).toBeDefined();
    expect(subjectsSection).toBeDefined();
    expect(tagsSection).toBeDefined();
    const titleFieldLabel = titleSection.querySelector('h2');
    expect(titleFieldLabel.textContent).toEqual('common.labels.title');
    const titleFieldHelpText = titleSection.querySelector('p');
    expect(titleFieldHelpText.textContent).toEqual('shared.title.description');
    const descriptionFieldLabel = descriptionSection.querySelector('h2');
    expect(descriptionFieldLabel.textContent).toEqual('common.labels.description');
    const descriptionFieldHelpText = descriptionSection.querySelector('p');
    expect(descriptionFieldHelpText.textContent).toEqual('shared.description.message');
  });
});
