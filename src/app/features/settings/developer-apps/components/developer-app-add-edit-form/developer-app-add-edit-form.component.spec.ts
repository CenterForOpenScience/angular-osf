import { provideStore } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperAppsState } from '../../store';

import { DeveloperAppAddEditFormComponent } from './developer-app-add-edit-form.component';

describe('CreateDeveloperAppComponent', () => {
  let component: DeveloperAppAddEditFormComponent;
  let fixture: ComponentFixture<DeveloperAppAddEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeveloperAppAddEditFormComponent, MockPipe(TranslatePipe)],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore([DeveloperAppsState]),
        MockProvider(TranslateService),
        MockProvider(DynamicDialogRef),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeveloperAppAddEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
