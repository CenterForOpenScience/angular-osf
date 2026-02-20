import { MockComponents, MockDirective } from 'ng-mocks';

import { Textarea } from 'primeng/textarea';

import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { FormSelectComponent } from '@osf/shared/components/form-select/form-select.component';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';

import { resourceTypeOptions } from '../../constants';
import { RegistryResourceFormModel } from '../../models';

import { ResourceFormComponent } from './resource-form.component';

import { provideOSFCore } from '@testing/osf.testing.provider';

const MOCK_FORM_GROUP = new FormGroup<RegistryResourceFormModel>({
  pid: new FormControl('10.1234/test'),
  resourceType: new FormControl('dataset'),
  description: new FormControl('Test description'),
});

describe('ResourceFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ResourceFormComponent,
        ...MockComponents(FormSelectComponent, TextInputComponent),
        MockDirective(Textarea),
      ],
      providers: [provideOSFCore()],
    });
  });

  it('should create with default input values', () => {
    const fixture = TestBed.createComponent(ResourceFormComponent);
    fixture.componentRef.setInput('formGroup', MOCK_FORM_GROUP);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.showCancelButton()).toBe(true);
    expect(fixture.componentInstance.showPreviewButton()).toBe(false);
    expect(fixture.componentInstance.resourceOptions).toEqual(resourceTypeOptions);
  });

  it('should return correct form control via getControl', () => {
    const fixture = TestBed.createComponent(ResourceFormComponent);
    fixture.componentRef.setInput('formGroup', MOCK_FORM_GROUP);
    fixture.detectChanges();

    expect(fixture.componentInstance.getControl('pid')).toBe(MOCK_FORM_GROUP.get('pid'));
    expect(fixture.componentInstance.getControl('pid')?.value).toBe('10.1234/test');
  });

  it('should emit cancelClicked on handleCancel', () => {
    const fixture = TestBed.createComponent(ResourceFormComponent);
    fixture.componentRef.setInput('formGroup', MOCK_FORM_GROUP);
    fixture.detectChanges();

    const spy = jest.fn();
    fixture.componentInstance.cancelClicked.subscribe(spy);
    fixture.componentInstance.handleCancel();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit submitClicked on handleSubmit', () => {
    const fixture = TestBed.createComponent(ResourceFormComponent);
    fixture.componentRef.setInput('formGroup', MOCK_FORM_GROUP);
    fixture.detectChanges();

    const spy = jest.fn();
    fixture.componentInstance.submitClicked.subscribe(spy);
    fixture.componentInstance.handleSubmit();

    expect(spy).toHaveBeenCalled();
  });
});
