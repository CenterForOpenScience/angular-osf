import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubHeaderComponent } from './sub-header.component';

describe('SubHeaderComponent', () => {
  let component: SubHeaderComponent;
  let fixture: ComponentFixture<SubHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set showButton input with default false', () => {
    expect(component.showButton()).toBe(false);
  });

  it('should set showButton input to true', () => {
    fixture.componentRef.setInput('showButton', true);
    expect(component.showButton()).toBe(true);
  });

  it('should set buttonLabel input with default empty string', () => {
    expect(component.buttonLabel()).toBe('');
  });

  it('should set buttonLabel input correctly', () => {
    fixture.componentRef.setInput('buttonLabel', 'Test Button');
    expect(component.buttonLabel()).toBe('Test Button');
  });

  it('should set buttonSeverity input with default primary', () => {
    expect(component.buttonSeverity()).toBe('primary');
  });

  it('should set buttonSeverity input to success', () => {
    fixture.componentRef.setInput('buttonSeverity', 'success');
    expect(component.buttonSeverity()).toBe('success');
  });

  it('should set buttonSeverity input to warning', () => {
    fixture.componentRef.setInput('buttonSeverity', 'warning');
    expect(component.buttonSeverity()).toBe('warning');
  });

  it('should set buttonSeverity input to danger', () => {
    fixture.componentRef.setInput('buttonSeverity', 'danger');
    expect(component.buttonSeverity()).toBe('danger');
  });

  it('should set buttonSeverity input to info', () => {
    fixture.componentRef.setInput('buttonSeverity', 'info');
    expect(component.buttonSeverity()).toBe('info');
  });

  it('should set buttonSeverity input to secondary', () => {
    fixture.componentRef.setInput('buttonSeverity', 'secondary');
    expect(component.buttonSeverity()).toBe('secondary');
  });

  it('should set buttonSeverity input to help', () => {
    fixture.componentRef.setInput('buttonSeverity', 'help');
    expect(component.buttonSeverity()).toBe('help');
  });

  it('should set buttonSeverity input to contrast', () => {
    fixture.componentRef.setInput('buttonSeverity', 'contrast');
    expect(component.buttonSeverity()).toBe('contrast');
  });

  it('should set title input correctly', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    expect(component.title()).toBe('Test Title');
  });

  it('should set icon input correctly', () => {
    fixture.componentRef.setInput('icon', 'pi-home');
    expect(component.icon()).toBe('pi-home');
  });

  it('should set tooltip input correctly', () => {
    fixture.componentRef.setInput('tooltip', 'Test tooltip text');
    expect(component.tooltip()).toBe('Test tooltip text');
  });

  it('should set description input correctly', () => {
    fixture.componentRef.setInput('description', 'Test description text');
    expect(component.description()).toBe('Test description text');
  });

  it('should set isLoading input to true', () => {
    fixture.componentRef.setInput('isLoading', true);
    expect(component.isLoading()).toBe(true);
  });

  it('should set isSubmitting input with default false', () => {
    expect(component.isSubmitting()).toBe(false);
  });

  it('should set isSubmitting input to true', () => {
    fixture.componentRef.setInput('isSubmitting', true);
    expect(component.isSubmitting()).toBe(true);
  });

  it('should set isButtonDisabled input with default false', () => {
    expect(component.isButtonDisabled()).toBe(false);
  });

  it('should set isButtonDisabled input to true', () => {
    fixture.componentRef.setInput('isButtonDisabled', true);
    expect(component.isButtonDisabled()).toBe(true);
  });

  it('should emit buttonClick event', () => {
    const emitSpy = jest.spyOn(component.buttonClick, 'emit');

    component.buttonClick.emit();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should handle long title text', () => {
    const longTitle =
      'This is a very long title that might be used for displaying detailed information about the current page or section';
    fixture.componentRef.setInput('title', longTitle);
    expect(component.title()).toBe(longTitle);
  });

  it('should handle long description text', () => {
    const longDescription =
      'This is a very long description that provides detailed information about the current context, functionality, or purpose of the page or component being displayed';
    fixture.componentRef.setInput('description', longDescription);
    expect(component.description()).toBe(longDescription);
  });

  it('should handle special characters in inputs', () => {
    fixture.componentRef.setInput('title', 'Title with special chars: @#$%^&*()');
    fixture.componentRef.setInput('description', 'Description with special chars: <>&"\'');
    fixture.componentRef.setInput('buttonLabel', 'Button with special chars: !@#$%');
    fixture.componentRef.setInput('tooltip', 'Tooltip with special chars: [{}]|\\');
    fixture.componentRef.setInput('icon', 'pi-icon-with-special-chars');

    expect(component.title()).toBe('Title with special chars: @#$%^&*()');
    expect(component.description()).toBe('Description with special chars: <>&"\'');
    expect(component.buttonLabel()).toBe('Button with special chars: !@#$%');
    expect(component.tooltip()).toBe('Tooltip with special chars: [{}]|\\');
    expect(component.icon()).toBe('pi-icon-with-special-chars');
  });

  it('should handle empty strings in inputs', () => {
    fixture.componentRef.setInput('title', '');
    fixture.componentRef.setInput('description', '');
    fixture.componentRef.setInput('buttonLabel', '');
    fixture.componentRef.setInput('tooltip', '');
    fixture.componentRef.setInput('icon', '');

    expect(component.title()).toBe('');
    expect(component.description()).toBe('');
    expect(component.buttonLabel()).toBe('');
    expect(component.tooltip()).toBe('');
    expect(component.icon()).toBe('');
  });

  it('should handle rapid input changes', () => {
    fixture.componentRef.setInput('title', 'Title 1');
    expect(component.title()).toBe('Title 1');

    fixture.componentRef.setInput('title', 'Title 2');
    expect(component.title()).toBe('Title 2');

    fixture.componentRef.setInput('title', 'Title 3');
    expect(component.title()).toBe('Title 3');
  });

  it('should handle button states together', () => {
    fixture.componentRef.setInput('showButton', true);
    fixture.componentRef.setInput('isButtonDisabled', true);
    fixture.componentRef.setInput('buttonLabel', 'Disabled Button');

    expect(component.showButton()).toBe(true);
    expect(component.isButtonDisabled()).toBe(true);
    expect(component.buttonLabel()).toBe('Disabled Button');
  });
});
