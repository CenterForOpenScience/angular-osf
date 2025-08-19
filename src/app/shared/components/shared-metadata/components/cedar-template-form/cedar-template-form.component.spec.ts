import { TranslatePipe } from '@ngx-translate/core';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CEDAR_CONFIG } from '@osf/features/project/metadata/constants';
import { CedarMetadataHelper } from '@osf/features/project/metadata/helpers';
import { CedarMetadataDataTemplateJsonApi, CedarMetadataRecordData } from '@osf/features/project/metadata/models';
import { CedarTemplateFormComponent } from '@shared/components/shared-metadata/components';

// Mock the CedarMetadataHelper
jest.mock('@osf/features/project/metadata/helpers', () => ({
  CedarMetadataHelper: {
    buildStructuredMetadata: jest.fn(),
    buildEmptyMetadata: jest.fn(),
  },
}));

// Mock the CEDAR_CONFIG
jest.mock('@osf/features/project/metadata/constants', () => ({
  CEDAR_CONFIG: {
    showSampleTemplateLinks: false,
    terminologyIntegratedSearchUrl: 'https://terminology.metadatacenter.org/bioportal/integrated-search',
    showTemplateRenderingRepresentation: false,
    showInstanceDataCore: false,
    showMultiInstanceInfo: false,
    showInstanceDataFull: false,
    showTemplateSourceData: false,
    showDataQualityReport: false,
    showHeader: false,
    showFooter: false,
    readOnlyMode: false,
    hideEmptyFields: false,
    showPreferencesMenu: false,
    strictValidation: false,
    autoInitializeFields: true,
  },
}));

describe('CedarTemplateFormComponent', () => {
  let component: CedarTemplateFormComponent;
  let fixture: ComponentFixture<CedarTemplateFormComponent>;
  let mockCedarMetadataHelper: jest.Mocked<typeof CedarMetadataHelper>;

  const mockTemplate: CedarMetadataDataTemplateJsonApi = {
    id: 'template-1',
    type: 'cedar-metadata-templates',
    attributes: {
      template: {
        '@id': 'template-1',
        '@type': 'https://schema.metadatacenter.org/core/Template',
        type: 'https://schema.metadatacenter.org/core/Template',
        title: 'Test Template',
        description: 'Test Description',
        $schema: 'https://schema.metadatacenter.org/core/Template',
        '@context': {
          pav: 'http://purl.org/pav/',
          xsd: 'http://www.w3.org/2001/XMLSchema#',
          bibo: 'http://purl.org/ontology/bibo/',
          oslc: 'http://open-services.net/ns/core#',
          schema: 'http://schema.org/',
          'schema:name': { '@type': 'xsd:string' },
          'pav:createdBy': { '@type': 'xsd:string' },
          'pav:createdOn': { '@type': 'xsd:dateTime' },
          'oslc:modifiedBy': { '@type': 'xsd:string' },
          'pav:lastUpdatedOn': { '@type': 'xsd:dateTime' },
          'schema:description': { '@type': 'xsd:string' },
        },
        required: [],
        properties: {},
        _ui: {
          order: [],
          propertyLabels: {},
          propertyDescriptions: {},
        },
      },
    },
  };

  const mockExistingRecord: CedarMetadataRecordData = {
    id: 'record-1',
    type: 'cedar_metadata_records',
    attributes: {
      metadata: {
        '@context': {},
        'Project Name': { '@value': 'Test Project' },
        Constructs: [],
        Assessments: [],
        'Project Methods': [],
        'Participant Types': [],
        'Special Populations': [],
        'Educational Curricula': [],
        LDbaseInvestigatorORCID: [],
      },
      is_published: false,
    },
    relationships: {
      template: {
        data: {
          type: 'cedar-metadata-templates',
          id: 'template-1',
        },
      },
      target: {
        data: {
          type: 'nodes',
          id: 'project-1',
        },
      },
    },
  };

  beforeEach(async () => {
    mockCedarMetadataHelper = CedarMetadataHelper as jest.Mocked<typeof CedarMetadataHelper>;

    // Reset mocks
    jest.clearAllMocks();

    // Setup default mock implementations
    mockCedarMetadataHelper.buildStructuredMetadata.mockReturnValue({
      '@context': {},
      'Project Name': { '@value': 'Test Project' },
      Constructs: [],
      Assessments: [],
      'Project Methods': [],
      'Participant Types': [],
      'Special Populations': [],
      'Educational Curricula': [],
      LDbaseInvestigatorORCID: [],
    });

    mockCedarMetadataHelper.buildEmptyMetadata.mockReturnValue({
      '@context': {},
      Constructs: [],
      Assessments: [],
      'Project Methods': [],
      'Participant Types': [],
      'Special Populations': [],
      'Educational Curricula': [],
      LDbaseInvestigatorORCID: [],
    });

    await TestBed.configureTestingModule({
      imports: [CedarTemplateFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: TranslatePipe,
          useValue: {
            transform: jest.fn((key: string) => key),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CedarTemplateFormComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.cedarConfig).toEqual(CEDAR_CONFIG);
    expect(component.formData()).toEqual({});
  });

  it('should set template input and initialize form data', () => {
    // Set the template input
    component.template.set(mockTemplate);

    // Trigger change detection
    fixture.detectChanges();

    expect(component.template()).toEqual(mockTemplate);
    expect(mockCedarMetadataHelper.buildEmptyMetadata).toHaveBeenCalled();
  });

  it('should set existing record input and initialize form data with structured metadata', () => {
    // Set the template and existing record inputs
    component.template.set(mockTemplate);
    component.existingRecord.set(mockExistingRecord);

    // Trigger change detection
    fixture.detectChanges();

    expect(component.existingRecord()).toEqual(mockExistingRecord);
    expect(mockCedarMetadataHelper.buildStructuredMetadata).toHaveBeenCalledWith(
      mockExistingRecord.attributes.metadata
    );
  });

  it('should set readonly input and update cedar config', () => {
    // Set the readonly input
    component.readonly.set(true);

    // Trigger change detection
    fixture.detectChanges();

    expect(component.readonly()).toBe(true);
    expect(component.cedarConfig.readOnlyMode).toBe(true);
  });

  it('should handle cedar change event and update form data', () => {
    const mockEvent = {
      target: {
        currentMetadata: {
          '@context': {},
          'Project Name': { '@value': 'Updated Project' },
        },
      },
    } as CustomEvent;

    // Set initial form data
    component.formData.set({ '@context': {} });

    // Call the method
    component.onCedarChange(mockEvent);

    // Check that form data was updated
    expect(component.formData()).toEqual({
      '@context': {},
      'Project Name': { '@value': 'Updated Project' },
    });
  });

  it('should handle cedar change event with undefined currentMetadata', () => {
    const mockEvent = {
      target: {
        currentMetadata: undefined,
      },
    } as CustomEvent;

    const initialFormData = { '@context': {} };
    component.formData.set(initialFormData);

    // Call the method
    component.onCedarChange(mockEvent);

    // Form data should remain unchanged
    expect(component.formData()).toEqual(initialFormData);
  });

  it('should emit edit mode and update cedar config', () => {
    const editModeSpy = jest.spyOn(component.editMode, 'emit');

    // Set readonly to true initially
    component.readonly.set(true);
    component.cedarConfig.readOnlyMode = true;

    // Call the method
    component.editModeEmit();

    // Check that edit mode was emitted
    expect(editModeSpy).toHaveBeenCalled();
    expect(component.cedarConfig.readOnlyMode).toBe(false);
  });

  it('should emit change template event', () => {
    const changeTemplateSpy = jest.spyOn(component.changeTemplate, 'emit');

    // Call the method (this would be triggered by button click in template)
    component.changeTemplate.emit();

    // Check that change template was emitted
    expect(changeTemplateSpy).toHaveBeenCalled();
  });

  it('should handle submit with cedar editor data', () => {
    const emitDataSpy = jest.spyOn(component.emitData, 'emit');

    // Set template
    component.template.set(mockTemplate);

    // Mock the cedar editor element
    const mockCedarEditor = {
      currentMetadata: {
        '@context': {},
        'Project Name': { '@value': 'Submitted Project' },
      },
    };

    // Mock document.querySelector
    const querySelectorSpy = jest
      .spyOn(document, 'querySelector')
      .mockReturnValue(mockCedarEditor as unknown as Element);

    // Call the method
    component.onSubmit();

    // Check that emitData was called with correct data
    expect(emitDataSpy).toHaveBeenCalledWith({
      data: mockCedarEditor.currentMetadata,
      id: mockTemplate.id,
    });

    // Check that form data was updated
    expect(component.formData()).toEqual({
      data: mockCedarEditor.currentMetadata,
      id: mockTemplate.id,
    });

    querySelectorSpy.mockRestore();
  });

  it('should handle submit when cedar editor is not found', () => {
    const emitDataSpy = jest.spyOn(component.emitData, 'emit');

    // Set template
    component.template.set(mockTemplate);

    // Mock document.querySelector to return null
    const querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValue(null);

    // Call the method
    component.onSubmit();

    // Check that emitData was not called
    expect(emitDataSpy).not.toHaveBeenCalled();

    querySelectorSpy.mockRestore();
  });

  it('should handle submit when cedar editor has no currentMetadata', () => {
    const emitDataSpy = jest.spyOn(component.emitData, 'emit');

    // Set template
    component.template.set(mockTemplate);

    // Mock the cedar editor element without currentMetadata
    const mockCedarEditor = {};

    // Mock document.querySelector
    const querySelectorSpy = jest
      .spyOn(document, 'querySelector')
      .mockReturnValue(mockCedarEditor as unknown as Element);

    // Call the method
    component.onSubmit();

    // Check that emitData was not called
    expect(emitDataSpy).not.toHaveBeenCalled();

    querySelectorSpy.mockRestore();
  });

  it('should not initialize form data when template has no attributes.template', () => {
    const templateWithoutAttributes = {
      ...mockTemplate,
      attributes: {},
    };

    // Set the template input
    component.template.set(templateWithoutAttributes);

    // Trigger change detection
    fixture.detectChanges();

    // Helper methods should not be called
    expect(mockCedarMetadataHelper.buildEmptyMetadata).not.toHaveBeenCalled();
    expect(mockCedarMetadataHelper.buildStructuredMetadata).not.toHaveBeenCalled();
  });

  it('should handle effect when template changes', () => {
    // Set readonly to true
    component.readonly.set(true);

    // Set template
    component.template.set(mockTemplate);

    // Trigger change detection to run effects
    fixture.detectChanges();

    // Check that cedar config was updated
    expect(component.cedarConfig.readOnlyMode).toBe(true);

    // Check that helper method was called
    expect(mockCedarMetadataHelper.buildEmptyMetadata).toHaveBeenCalled();
  });
});
