import { provideStore } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe, MockProviders } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { ToastService } from '@osf/shared/services/toast.service';

import { DeveloperAppsState } from '../../store';

import { DeveloperAppAddEditFormComponent } from './developer-app-add-edit-form.component';

import { TranslateServiceMock } from '@testing/mocks/translate.service.mock';

describe('CreateDeveloperAppComponent', () => {
  let component: DeveloperAppAddEditFormComponent;
  let fixture: ComponentFixture<DeveloperAppAddEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeveloperAppAddEditFormComponent, MockComponent(TextInputComponent), MockPipe(TranslatePipe)],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore([DeveloperAppsState]),
        TranslateServiceMock,
        MockProviders(DynamicDialogRef, ToastService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeveloperAppAddEditFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as touched and dirty when invalid', () => {
    const form = component['appForm'];
    form.patchValue({
      name: '',
    });

    const markAllAsTouchedSpy = jest.spyOn(form, 'markAllAsTouched');
    const markAsDirtySpy = jest.spyOn(form.controls['name'], 'markAsDirty');

    component.handleSubmitForm();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(markAsDirtySpy).toHaveBeenCalled();
  });
});
