import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { CedarMetadataHelper } from '@osf/features/metadata/helpers';
import { CedarEditorElement } from '@osf/features/metadata/models';

import { MOCK_CEDAR_METADATA_RECORD, MOCK_CEDAR_METADATA_TEMPLATE } from '@testing/mocks/cedar-metadata-domain.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';

import { CedarTemplateFormComponent } from './cedar-template-form.component';

describe('CedarTemplateFormComponent', () => {
  let component: CedarTemplateFormComponent;
  let fixture: ComponentFixture<CedarTemplateFormComponent>;

  const mockTemplate = MOCK_CEDAR_METADATA_TEMPLATE;
  const mockRecord = MOCK_CEDAR_METADATA_RECORD;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CedarTemplateFormComponent],
      providers: [provideOSFCore(), MockProvider(ActivatedRoute, ActivatedRouteMockBuilder.create().build())],
    });

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
    fixture.componentRef.setInput('existingRecord', mockRecord);
    fixture.detectChanges();

    expect(component.existingRecord()).toEqual(mockRecord);
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
    const emitSpy = vi.spyOn(component.changeTemplate, 'emit');

    component.changeTemplate.emit();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit toggleEditMode event', () => {
    const emitSpy = vi.spyOn(component.toggleEditMode, 'emit');

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

  it('should load template and record metadata together into the editor', () => {
    const editor = {} as CedarEditorElement;
    vi.spyOn(component, 'cedarEditor').mockReturnValue({ nativeElement: editor } as never);

    fixture.componentRef.setInput('existingRecord', mockRecord);
    fixture.detectChanges();

    expect(editor.templateAndInstanceObject).toEqual({
      templateObject: mockTemplate.template,
      instanceObject: mockRecord.metadata,
    });
    expect(editor.instanceObject).toBeUndefined();
  });

  it('should publish on submit when the editor report is valid', () => {
    const editor = {
      currentMetadata: { field: 'value' },
      dataQualityReport: { isValid: true },
    } as unknown as CedarEditorElement;
    vi.spyOn(component, 'cedarEditor').mockReturnValue({ nativeElement: editor } as never);
    const emitSpy = vi.spyOn(component.emitData, 'emit');
    component.isValid = false;

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith({ data: { field: 'value' }, id: mockTemplate.id, isPublished: true });
  });

  it('should save as draft on submit when the editor report is not valid', () => {
    const editor = {
      currentMetadata: { field: 'value' },
      dataQualityReport: { isValid: false },
    } as unknown as CedarEditorElement;
    vi.spyOn(component, 'cedarEditor').mockReturnValue({ nativeElement: editor } as never);
    const emitSpy = vi.spyOn(component.emitData, 'emit');

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith({ data: { field: 'value' }, id: mockTemplate.id, isPublished: false });
  });
});
