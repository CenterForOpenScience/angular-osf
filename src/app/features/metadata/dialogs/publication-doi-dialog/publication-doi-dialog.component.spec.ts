import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';

import { PublicationDoiDialogComponent } from './publication-doi-dialog.component';

describe('PublicationDoiDialogComponent', () => {
  let component: PublicationDoiDialogComponent;
  let fixture: ComponentFixture<PublicationDoiDialogComponent>;
  let dialogRef: DynamicDialogRef;
  let config: DynamicDialogConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PublicationDoiDialogComponent],
      providers: [provideOSFCore(), provideDynamicDialogRefMock(), MockProvider(DynamicDialogConfig)],
    });

    fixture = TestBed.createComponent(PublicationDoiDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);
    config = TestBed.inject(DynamicDialogConfig);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with null DOI by default', () => {
    expect(component.publicationDoiControl.value).toBeNull();
  });

  it('should initialize with config data if provided', () => {
    const testDoi = '10.1234/test.doi';
    config.data = testDoi;

    fixture = TestBed.createComponent(PublicationDoiDialogComponent);
    component = fixture.componentInstance;

    expect(component.publicationDoiControl.value).toBe(testDoi);
  });

  it('should close dialog with DOI value on save', () => {
    const testDoi = '10.1234/test.doi';
    component.publicationDoiControl.setValue(testDoi);

    component.save();

    expect(dialogRef.close).toHaveBeenCalledWith({ value: testDoi });
  });

  it('should close dialog with null when DOI is empty on save', () => {
    component.publicationDoiControl.setValue('');

    component.save();

    expect(dialogRef.close).toHaveBeenCalledWith({ value: null });
  });

  it('should close dialog without data on cancel', () => {
    component.cancel();

    expect(dialogRef.close).toHaveBeenCalledWith();
  });

  it('should validate valid DOI format', () => {
    component.publicationDoiControl.setValue('10.1234/test.doi');

    expect(component.publicationDoiControl.valid).toBe(true);
  });

  it('should invalidate incorrect DOI format', () => {
    component.publicationDoiControl.setValue('invalid-doi');

    expect(component.publicationDoiControl.invalid).toBe(true);
  });

  it('should allow empty DOI', () => {
    component.publicationDoiControl.setValue('');

    expect(component.publicationDoiControl.valid).toBe(true);
  });
});
