import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipes, MockProvider } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCollectionState } from '@osf/features/collections/store/add-to-collection';
import { TagsInputComponent, TextInputComponent, TruncatedTextComponent } from '@shared/components';
import { InterpolatePipe } from '@shared/pipes';
import { ToastService } from '@shared/services';
import { ProjectsState } from '@shared/stores';

import { ProjectMetadataStepComponent } from './project-metadata-step.component';

describe.skip('ProjectMetadataStepComponent', () => {
  let component: ProjectMetadataStepComponent;
  let fixture: ComponentFixture<ProjectMetadataStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProjectMetadataStepComponent,
        ...MockComponents(TagsInputComponent, TextInputComponent, TruncatedTextComponent),
        MockPipes(InterpolatePipe, TranslatePipe),
      ],
      teardown: { destroyAfterEach: false },
      providers: [
        MockProvider(ToastService),
        provideStore([ProjectsState, AddToCollectionState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetadataStepComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('stepperActiveValue', 0);
    fixture.componentRef.setInput('targetStepValue', 2);
    fixture.componentRef.setInput('isDisabled', false);
    fixture.componentRef.setInput('providerId', 'id1');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
