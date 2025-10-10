import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadDialogComponent } from './file-upload-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('FileUploadDialogComponent', () => {
  let component: FileUploadDialogComponent;
  let fixture: ComponentFixture<FileUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadDialogComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.visible()).toBe(false);
    expect(component.fileName()).toBe('');
    expect(component.progress()).toBe(0);
  });

  it('should accept fileName input', () => {
    fixture.componentRef.setInput('fileName', 'test-file.pdf');
    fixture.detectChanges();

    expect(component.fileName()).toBe('test-file.pdf');
  });

  it('should accept progress input', () => {
    fixture.componentRef.setInput('progress', 50);
    fixture.detectChanges();

    expect(component.progress()).toBe(50);
  });

  it('should accept progress input at 0', () => {
    fixture.componentRef.setInput('progress', 0);
    fixture.detectChanges();

    expect(component.progress()).toBe(0);
  });

  it('should accept progress input at 100', () => {
    fixture.componentRef.setInput('progress', 100);
    fixture.detectChanges();

    expect(component.progress()).toBe(100);
  });

  it('should update visible model', () => {
    component.visible.set(true);
    fixture.detectChanges();

    expect(component.visible()).toBe(true);
  });

  it('should toggle visible state', () => {
    expect(component.visible()).toBe(false);

    component.visible.set(true);
    expect(component.visible()).toBe(true);

    component.visible.set(false);
    expect(component.visible()).toBe(false);
  });

  it('should handle multiple inputs together', () => {
    fixture.componentRef.setInput('fileName', 'document.docx');
    fixture.componentRef.setInput('progress', 75);
    component.visible.set(true);
    fixture.detectChanges();

    expect(component.fileName()).toBe('document.docx');
    expect(component.progress()).toBe(75);
    expect(component.visible()).toBe(true);
  });

  it('should handle long file names', () => {
    const longFileName = 'very-long-file-name-with-many-characters-that-might-cause-display-issues.pdf';
    fixture.componentRef.setInput('fileName', longFileName);
    fixture.detectChanges();

    expect(component.fileName()).toBe(longFileName);
  });

  it('should handle file names with special characters', () => {
    const specialFileName = 'file (1) [copy] - final_version.txt';
    fixture.componentRef.setInput('fileName', specialFileName);
    fixture.detectChanges();

    expect(component.fileName()).toBe(specialFileName);
  });

  it('should handle progress updates during upload', () => {
    const progressValues = [0, 25, 50, 75, 100];

    progressValues.forEach((progress) => {
      fixture.componentRef.setInput('progress', progress);
      fixture.detectChanges();
      expect(component.progress()).toBe(progress);
    });
  });

  it('should handle empty file name', () => {
    fixture.componentRef.setInput('fileName', '');
    fixture.detectChanges();

    expect(component.fileName()).toBe('');
  });

  it('should update fileName during upload', () => {
    fixture.componentRef.setInput('fileName', 'initial-file.pdf');
    fixture.detectChanges();
    expect(component.fileName()).toBe('initial-file.pdf');

    fixture.componentRef.setInput('fileName', 'updated-file.pdf');
    fixture.detectChanges();
    expect(component.fileName()).toBe('updated-file.pdf');
  });

  it('should handle progress reset', () => {
    fixture.componentRef.setInput('progress', 100);
    fixture.detectChanges();
    expect(component.progress()).toBe(100);

    fixture.componentRef.setInput('progress', 0);
    fixture.detectChanges();
    expect(component.progress()).toBe(0);
  });

  it('should maintain state across multiple operations', () => {
    fixture.componentRef.setInput('fileName', 'first-file.pdf');
    fixture.componentRef.setInput('progress', 50);
    component.visible.set(true);
    fixture.detectChanges();

    expect(component.fileName()).toBe('first-file.pdf');
    expect(component.progress()).toBe(50);
    expect(component.visible()).toBe(true);

    fixture.componentRef.setInput('fileName', 'second-file.pdf');
    fixture.componentRef.setInput('progress', 25);
    fixture.detectChanges();

    expect(component.fileName()).toBe('second-file.pdf');
    expect(component.progress()).toBe(25);
    expect(component.visible()).toBe(true);
  });

  it('should handle visibility changes independently of other inputs', () => {
    fixture.componentRef.setInput('fileName', 'test.pdf');
    fixture.componentRef.setInput('progress', 50);
    fixture.detectChanges();

    component.visible.set(true);
    expect(component.visible()).toBe(true);
    expect(component.fileName()).toBe('test.pdf');
    expect(component.progress()).toBe(50);

    component.visible.set(false);
    expect(component.visible()).toBe(false);
    expect(component.fileName()).toBe('test.pdf');
    expect(component.progress()).toBe(50);
  });
});
