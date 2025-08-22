import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { SelectOption } from '@osf/shared/models';
import { TranslateServiceMock } from '@shared/mocks';

import { FormSelectComponent } from './form-select.component';

describe('FormSelectComponent', () => {
  let component: FormSelectComponent;
  let fixture: ComponentFixture<FormSelectComponent>;
  let componentRef: ComponentRef<FormSelectComponent>;

  const mockOptions: SelectOption[] = [
    { label: 'option.one', value: 'one' },
    { label: 'option.two', value: 'two' },
  ];

  const mockFormControl = new FormControl('');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSelectComponent, ReactiveFormsModule],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(FormSelectComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default input values', () => {
    expect(component.label()).toBe('');
    expect(component.placeholder()).toBe('');
    expect(component.appendTo()).toBeNull();
    expect(component.fullWidth()).toBe(false);
  });

  it('should work with both required inputs', () => {
    componentRef.setInput('control', mockFormControl);
    componentRef.setInput('options', mockOptions);
    fixture.detectChanges();

    expect(component.control()).toBe(mockFormControl);
    expect(component.options()).toBe(mockOptions);
  });
});
