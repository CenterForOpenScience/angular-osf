import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormSelectComponent, TextInputComponent } from '@shared/components';

import { RegistryResourceFormModel } from '../../models';

import { ResourceFormComponent } from './resource-form.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ResourceFormComponent', () => {
  let component: ResourceFormComponent;
  let fixture: ComponentFixture<ResourceFormComponent>;

  const mockFormGroup = new FormGroup<RegistryResourceFormModel>({
    pid: new FormControl('10.1234/test'),
    resourceType: new FormControl('dataset'),
    description: new FormControl('Test description'),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ResourceFormComponent,
        OSFTestingModule,
        ReactiveFormsModule,
        ...MockComponents(TextInputComponent, FormSelectComponent),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceFormComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('formGroup', mockFormGroup);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.showCancelButton()).toBe(true);
    expect(component.showPreviewButton()).toBe(false);
    expect(component.cancelButtonLabel()).toBe('common.buttons.cancel');
    expect(component.primaryButtonLabel()).toBe('common.buttons.save');
  });

  it('should receive formGroup input', () => {
    expect(component.formGroup()).toBe(mockFormGroup);
  });

  it('should get control by name', () => {
    const pidControl = component.getControl('pid');
    const resourceTypeControl = component.getControl('resourceType');
    const descriptionControl = component.getControl('description');

    expect(pidControl).toBe(mockFormGroup.get('pid'));
    expect(resourceTypeControl).toBe(mockFormGroup.get('resourceType'));
    expect(descriptionControl).toBe(mockFormGroup.get('description'));
  });

  it('should emit cancelClicked when handleCancel is called', () => {
    const cancelSpy = jest.fn();
    component.cancelClicked.subscribe(cancelSpy);

    component.handleCancel();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should emit submitClicked when handleSubmit is called', () => {
    const submitSpy = jest.fn();
    component.submitClicked.subscribe(submitSpy);

    component.handleSubmit();

    expect(submitSpy).toHaveBeenCalled();
  });

  it('should handle different input configurations', () => {
    fixture.componentRef.setInput('showCancelButton', false);
    fixture.componentRef.setInput('showPreviewButton', true);
    fixture.componentRef.setInput('cancelButtonLabel', 'Custom Cancel');
    fixture.componentRef.setInput('primaryButtonLabel', 'Custom Save');
    fixture.detectChanges();

    expect(component.showCancelButton()).toBe(false);
    expect(component.showPreviewButton()).toBe(true);
    expect(component.cancelButtonLabel()).toBe('Custom Cancel');
    expect(component.primaryButtonLabel()).toBe('Custom Save');
  });

  it('should handle form with different values', () => {
    const newFormGroup = new FormGroup<RegistryResourceFormModel>({
      pid: new FormControl('10.1234/new-test'),
      resourceType: new FormControl('software'),
      description: new FormControl('New description'),
    });

    fixture.componentRef.setInput('formGroup', newFormGroup);
    fixture.detectChanges();

    expect(component.formGroup()).toBe(newFormGroup);
    expect(component.getControl('pid')?.value).toBe('10.1234/new-test');
    expect(component.getControl('resourceType')?.value).toBe('software');
    expect(component.getControl('description')?.value).toBe('New description');
  });

  it('should handle form with empty values', () => {
    const emptyFormGroup = new FormGroup<RegistryResourceFormModel>({
      pid: new FormControl(''),
      resourceType: new FormControl(''),
      description: new FormControl(''),
    });

    fixture.componentRef.setInput('formGroup', emptyFormGroup);
    fixture.detectChanges();

    expect(component.getControl('pid')?.value).toBe('');
    expect(component.getControl('resourceType')?.value).toBe('');
    expect(component.getControl('description')?.value).toBe('');
  });

  it('should handle form with null values', () => {
    const nullFormGroup = new FormGroup<RegistryResourceFormModel>({
      pid: new FormControl(null),
      resourceType: new FormControl(null),
      description: new FormControl(null),
    });

    fixture.componentRef.setInput('formGroup', nullFormGroup);
    fixture.detectChanges();

    expect(component.getControl('pid')?.value).toBe(null);
    expect(component.getControl('resourceType')?.value).toBe(null);
    expect(component.getControl('description')?.value).toBe(null);
  });
});
