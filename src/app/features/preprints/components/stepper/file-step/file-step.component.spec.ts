import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { MOCK_PROVIDER, MOCK_STORE } from '@shared/mocks';
import { CustomConfirmationService, FilesService, ToastService } from '@shared/services';

import { FileStepComponent } from './file-step.component';

describe.skip('FileStepComponent', () => {
  let component: FileStepComponent;
  let fixture: ComponentFixture<FileStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileStepComponent, MockPipe(TranslatePipe)],
      providers: [
        MockProvider(Store, MOCK_STORE),
        MockProvider(DialogService),
        MockProvider(ToastService),
        MockProvider(CustomConfirmationService),
        MockProvider(TranslateService),
        MockProvider(ActivatedRoute, {}),
        MockProvider(Router, {}),
        MockProvider(FilesService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FileStepComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('provider', MOCK_PROVIDER);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
