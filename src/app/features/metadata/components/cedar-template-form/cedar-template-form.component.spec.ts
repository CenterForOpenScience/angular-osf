import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CedarMetadataHelper } from '@osf/features/metadata/helpers';
import { CedarMetadataDataTemplateJsonApi } from '@osf/features/metadata/models';
import { CEDAR_METADATA_DATA_TEMPLATE_JSON_API_MOCK } from '@shared/mocks';

import { CedarTemplateFormComponent } from './cedar-template-form.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('CedarTemplateFormComponent', () => {
  let component: CedarTemplateFormComponent;
  let fixture: ComponentFixture<CedarTemplateFormComponent>;

  const mockTemplate: CedarMetadataDataTemplateJsonApi = CEDAR_METADATA_DATA_TEMPLATE_JSON_API_MOCK;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CedarTemplateFormComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CedarTemplateFormComponent);
    fixture.componentRef.setInput('template', mockTemplate);
    fixture.componentRef.setInput('existingRecord', null);
    fixture.componentRef.setInput('readonly', false);
    fixture.componentRef.setInput('showEditButton', false);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set template input', () => {
    fixture.componentRef.setInput('template', mockTemplate);
    fixture.detectChanges();

    expect(component.template()).toEqual(mockTemplate);
  });

  it('should set existingRecord input', () => {
    fixture.componentRef.setInput('existingRecord', mockTemplate);
    fixture.detectChanges();

    expect(component.existingRecord()).toEqual(mockTemplate);
  });

  it('should set readonly input', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    expect(component.readonly()).toBe(true);
  });

  it('should set showEditButton input', () => {
    fixture.componentRef.setInput('showEditButton', true);
    fixture.detectChanges();

    expect(component.showEditButton()).toBe(true);
  });

  it('should emit changeTemplate event', () => {
    const emitSpy = jest.spyOn(component.changeTemplate, 'emit');

    component.changeTemplate.emit();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit toggleEditMode event', () => {
    const emitSpy = jest.spyOn(component.toggleEditMode, 'emit');

    component.toggleEditMode.emit();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should initialize form data with empty metadata when no existing record', () => {
    fixture.componentRef.setInput('existingRecord', null);
    fixture.detectChanges();

    const expectedEmptyMetadata = CedarMetadataHelper.buildEmptyMetadata();
    expect(component.formData()).toEqual(expectedEmptyMetadata);
  });

  it('should handle cedar change event with undefined currentMetadata', () => {
    const mockEvent = new CustomEvent('change', {});
    const mockCedarEditor = {};

    Object.defineProperty(mockEvent, 'target', {
      value: mockCedarEditor,
      writable: true,
    });

    const initialFormData = component.formData();
    component.onCedarChange(mockEvent);

    expect(component.formData()).toEqual(initialFormData);
  });
});
