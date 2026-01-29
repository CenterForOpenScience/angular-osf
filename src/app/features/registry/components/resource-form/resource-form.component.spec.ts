import { MockComponents, MockDirective } from 'ng-mocks';

import { Textarea } from 'primeng/textarea';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { FormSelectComponent } from '@osf/shared/components/form-select/form-select.component';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';
import { InputLimits } from '@osf/shared/constants/input-limits.const';

import { resourceTypeOptions } from '../../constants';
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
        ...MockComponents(TextInputComponent, FormSelectComponent),
        MockDirective(Textarea),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceFormComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('formGroup', mockFormGroup);
    fixture.detectChanges();
  });

  it('should initialize inputLimits with InputLimits constant', () => {
    expect(component.inputLimits).toBe(InputLimits);
  });

  it('should initialize resourceOptions signal with resourceTypeOptions', () => {
    expect(component.resourceOptions()).toEqual(resourceTypeOptions);
  });

  it('should initialize with default input values', () => {
    expect(component.showCancelButton()).toBe(true);
    expect(component.showPreviewButton()).toBe(false);
    expect(component.cancelButtonLabel()).toBe('common.buttons.cancel');
    expect(component.primaryButtonLabel()).toBe('common.buttons.save');
  });

  it('should receive and store formGroup input', () => {
    expect(component.formGroup()).toBe(mockFormGroup);
  });

  it('should update when formGroup input changes', () => {
    const newFormGroup = new FormGroup<RegistryResourceFormModel>({
      pid: new FormControl('10.1234/new-test'),
      resourceType: new FormControl('software'),
      description: new FormControl('New description'),
    });

    fixture.componentRef.setInput('formGroup', newFormGroup);
    fixture.detectChanges();

    expect(component.formGroup()).toBe(newFormGroup);
  });

  it('should return correct control for pid', () => {
    const control = component.getControl('pid');
    expect(control).toBe(mockFormGroup.get('pid'));
    expect(control?.value).toBe('10.1234/test');
  });

  it('should update showCancelButton input', () => {
    fixture.componentRef.setInput('showCancelButton', false);
    fixture.detectChanges();

    expect(component.showCancelButton()).toBe(false);
  });

  it('should update showPreviewButton input', () => {
    fixture.componentRef.setInput('showPreviewButton', true);
    fixture.detectChanges();

    expect(component.showPreviewButton()).toBe(true);
  });

  it('should update cancelButtonLabel input', () => {
    const customLabel = 'Custom Cancel';
    fixture.componentRef.setInput('cancelButtonLabel', customLabel);
    fixture.detectChanges();

    expect(component.cancelButtonLabel()).toBe(customLabel);
  });

  it('should update primaryButtonLabel input', () => {
    const customLabel = 'Custom Save';
    fixture.componentRef.setInput('primaryButtonLabel', customLabel);
    fixture.detectChanges();

    expect(component.primaryButtonLabel()).toBe(customLabel);
  });

  it('should handle multiple input updates simultaneously', () => {
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
});
