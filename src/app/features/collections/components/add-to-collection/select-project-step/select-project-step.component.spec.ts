import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserState } from '@core/store/user';
import { TranslateServiceMock } from '@shared/mocks';
import { ToastService } from '@shared/services';
import { CollectionsState, ProjectsState } from '@shared/stores';

import { SelectProjectStepComponent } from './select-project-step.component';

describe.skip('SelectProjectStepComponent', () => {
  let component: SelectProjectStepComponent;
  let fixture: ComponentFixture<SelectProjectStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectProjectStepComponent, MockPipe(TranslatePipe)],
      providers: [
        TranslateServiceMock,
        MockProvider(ToastService),
        provideStore([ProjectsState, UserState, CollectionsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectProjectStepComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('stepperActiveValue', 0);
    fixture.componentRef.setInput('targetStepValue', 2);
    fixture.componentRef.setInput('collectionId', 'id1');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
