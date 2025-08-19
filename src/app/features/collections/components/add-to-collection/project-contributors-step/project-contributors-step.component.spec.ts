import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe, MockProviders } from 'ng-mocks';

import { ConfirmationService } from 'primeng/api';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsListComponent } from '@shared/components/contributors';
import { TranslateServiceMock } from '@shared/mocks';
import { ToastService } from '@shared/services';
import { ContributorsState, ProjectsState } from '@shared/stores';

import { ProjectContributorsStepComponent } from './project-contributors-step.component';

describe.skip('ProjectContributorsStepComponent', () => {
  let component: ProjectContributorsStepComponent;
  let fixture: ComponentFixture<ProjectContributorsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectContributorsStepComponent, MockComponent(ContributorsListComponent), MockPipe(TranslatePipe)],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MockProviders(ToastService, ConfirmationService),
        TranslateServiceMock,
        provideStore([ContributorsState, ProjectsState]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectContributorsStepComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('stepperActiveValue', 0);
    fixture.componentRef.setInput('targetStepValue', 2);
    fixture.componentRef.setInput('isDisabled', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
