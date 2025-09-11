import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateServiceMock } from '@shared/mocks';

import { DescriptionDialogComponent } from './description-dialog.component';

describe('DescriptionDialogComponent', () => {
  let component: DescriptionDialogComponent;
  let fixture: ComponentFixture<DescriptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionDialogComponent],
      providers: [TranslateServiceMock, MockProvider(DynamicDialogRef), MockProvider(DynamicDialogConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(DescriptionDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not set description control value when currentProject is null', () => {
    Object.defineProperty(component, 'currentProject', {
      get: () => null,
    });

    component.ngOnInit();

    expect(component.descriptionControl.value).toBe('');
  });

  it('should handle save with valid form', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    jest.spyOn(dialogRef, 'close');
    const validDescription = { value: 'Valid description' };

    component.descriptionControl.setValue(validDescription.value);
    component.save();

    expect(dialogRef.close).toHaveBeenCalledWith(validDescription);
  });

  it('should handle cancel', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    jest.spyOn(dialogRef, 'close');

    component.cancel();

    expect(dialogRef.close).toHaveBeenCalled();
  });
});
