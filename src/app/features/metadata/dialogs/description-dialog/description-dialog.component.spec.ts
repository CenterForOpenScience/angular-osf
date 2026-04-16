import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { DescriptionDialogComponent } from './description-dialog.component';

describe('DescriptionDialogComponent', () => {
  let component: DescriptionDialogComponent;
  let fixture: ComponentFixture<DescriptionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DescriptionDialogComponent],
      providers: [provideOSFCore(), MockProvider(DynamicDialogRef), MockProvider(DynamicDialogConfig)],
    });

    fixture = TestBed.createComponent(DescriptionDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle save with valid form', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    vi.spyOn(dialogRef, 'close');
    const validDescription = { value: 'Valid description' };

    component.descriptionControl.setValue(validDescription.value);
    component.save();

    expect(dialogRef.close).toHaveBeenCalledWith(validDescription);
  });

  it('should handle cancel', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    vi.spyOn(dialogRef, 'close');

    component.cancel();

    expect(dialogRef.close).toHaveBeenCalled();
  });
});
