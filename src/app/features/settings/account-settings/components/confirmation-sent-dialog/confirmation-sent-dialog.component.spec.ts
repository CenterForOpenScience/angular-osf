import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';

import { ConfirmationSentDialogComponent } from './confirmation-sent-dialog.component';

describe('ConfirmationSentDialogComponent', () => {
  let component: ConfirmationSentDialogComponent;
  let fixture: ComponentFixture<ConfirmationSentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmationSentDialogComponent],
      providers: [provideOSFCore(), MockProvider(DynamicDialogConfig), provideDynamicDialogRefMock()],
    });

    fixture = TestBed.createComponent(ConfirmationSentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
