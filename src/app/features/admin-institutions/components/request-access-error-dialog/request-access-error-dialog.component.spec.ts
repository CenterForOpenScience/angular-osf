import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAccessErrorDialogComponent } from './request-access-error-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('RequestAccessErrorDialogComponent', () => {
  let component: RequestAccessErrorDialogComponent;
  let fixture: ComponentFixture<RequestAccessErrorDialogComponent>;
  let mockDialogRef: jest.Mocked<DynamicDialogRef>;

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
      destroy: jest.fn(),
      onClose: jest.fn(),
      onDestroy: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [RequestAccessErrorDialogComponent, OSFTestingModule, MockPipe(TranslatePipe)],
      providers: [{ provide: DynamicDialogRef, useValue: mockDialogRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestAccessErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have dialogRef injected', () => {
    expect(component.dialogRef).toBeDefined();
    expect(component.dialogRef).toBe(mockDialogRef);
  });

  it('should close dialog when close method is called', () => {
    component.dialogRef.close(true);

    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with different return values', () => {
    component.dialogRef.close(false);
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);

    component.dialogRef.close('test');
    expect(mockDialogRef.close).toHaveBeenCalledWith('test');

    component.dialogRef.close();
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });
});
