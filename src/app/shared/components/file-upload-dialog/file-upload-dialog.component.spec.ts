import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { FileUploadDialogComponent } from './file-upload-dialog.component';

describe('FileUploadDialogComponent', () => {
  let component: FileUploadDialogComponent;
  let fixture: ComponentFixture<FileUploadDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FileUploadDialogComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(FileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default model and input values', () => {
    expect(component.visible()).toBe(false);
    expect(component.fileName()).toBe('');
    expect(component.progress()).toBe(0);
  });

  it('should update visible model value', () => {
    component.visible.set(true);
    expect(component.visible()).toBe(true);
  });

  it('should accept fileName and progress input values', () => {
    fixture.componentRef.setInput('fileName', 'my-file.pdf');
    fixture.componentRef.setInput('progress', 65);
    fixture.detectChanges();

    expect(component.fileName()).toBe('my-file.pdf');
    expect(component.progress()).toBe(65);
  });
});
