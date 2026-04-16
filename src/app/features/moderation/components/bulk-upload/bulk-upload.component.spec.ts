import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { BYTES_IN_MB, FILE_TYPES } from '../../constants';

import { BulkUploadComponent } from './bulk-upload.component';

describe('BulkUploadComponent', () => {
  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BulkUploadComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(BulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default maxSize', () => {
    expect(component.maxSize()).toBe(BYTES_IN_MB);
  });

  it('should have default acceptTypes', () => {
    expect(component.acceptTypes()).toBe(FILE_TYPES.CSV);
  });

  it('should accept custom maxSize input', () => {
    fixture.componentRef.setInput('maxSize', 5 * BYTES_IN_MB);
    expect(component.maxSize()).toBe(5 * BYTES_IN_MB);
  });

  it('should accept custom acceptTypes input', () => {
    fixture.componentRef.setInput('acceptTypes', '.xlsx');
    expect(component.acceptTypes()).toBe('.xlsx');
  });
});
