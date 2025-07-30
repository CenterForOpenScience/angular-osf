import { provideStore, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import {
  CedarMetadataDataTemplateJsonApi,
  CedarMetadataRecord,
  CedarMetadataRecordData,
  CedarRecordDataBinding,
} from '@osf/features/project/metadata/models';
import { CedarFormMapper } from '@osf/features/registry/mappers';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@shared/components';
import { CedarTemplateFormComponent } from '@shared/components/shared-metadata/components';
import { ToastService } from '@shared/services';

import { RegistryMetadataState } from '../../store/registry-metadata';

import { RegistryMetadataAddComponent } from './registry-metadata-add.component';

jest.mock('@osf/features/registry/mappers', () => ({
  CedarFormMapper: jest.fn(),
}));

describe('RegistryMetadataAddComponent', () => {
  let component: RegistryMetadataAddComponent;
  let fixture: ComponentFixture<RegistryMetadataAddComponent>;
  let store: Store;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let toastService: ToastService;

  const mockRegistryId = 'test-registry-id';
  const mockRecordId = 'test-record-id';

  const mockCedarTemplate: CedarMetadataDataTemplateJsonApi = {
    id: 'template-1',
    type: 'cedar-metadata-templates',
    attributes: {
      schema_name: 'Test Template',
      cedar_id: 'cedar-123',
      template: {
        '@id': 'test-id',
        '@type': 'test-type',
        type: 'object',
        title: 'Test Template',
        description: 'Test Description',
        $schema: 'http://json-schema.org/draft-04/schema#',
        '@context': {
          pav: 'http://purl.org/pav/',
          xsd: 'http://www.w3.org/2001/XMLSchema#',
          bibo: 'http://purl.org/ontology/bibo/',
          oslc: 'http://open-services.net/ns/core#',
          schema: 'http://schema.org/',
          'schema:name': { '@type': 'xsd:string' },
          'pav:createdBy': { '@type': '@id' },
          'pav:createdOn': { '@type': 'xsd:dateTime' },
          'oslc:modifiedBy': { '@type': '@id' },
          'pav:lastUpdatedOn': { '@type': 'xsd:dateTime' },
          'schema:description': { '@type': 'xsd:string' },
        },
        required: ['@context', 'schema:name'],
        properties: {},
        _ui: {
          order: ['schema:name'],
          propertyLabels: { 'schema:name': 'Name' },
          propertyDescriptions: { 'schema:name': 'Template name' },
        },
      },
    },
  };

  const mockCedarRecord: CedarMetadataRecordData = {
    id: mockRecordId,
    type: 'cedar_metadata_records',
    attributes: {
      metadata: {
        '@context': {},
        Constructs: [],
        Assessments: [],
        Organization: [],
        'Project Name': { '@value': 'Test Project' },
        LDbaseWebsite: {},
        'Project Methods': [],
        'Participant Types': [],
        'Special Populations': [],
        'Developmental Design': {},
        LDbaseProjectEndDate: { '@type': 'xsd:date', '@value': '2024-12-31' },
        'Educational Curricula': [],
        LDbaseInvestigatorORCID: [],
        LDbaseProjectStartDates: { '@type': 'xsd:date', '@value': '2024-01-01' },
        'Educational Environments': {},
        LDbaseProjectDescription: { '@value': 'Test Description' },
        LDbaseProjectContributors: [],
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
          type: 'registrations',
          id: mockRegistryId,
        },
      },
    },
  };

  const mockCedarTemplates = {
    data: [mockCedarTemplate],
    links: {
      first: 'http://api.test.com/first',
      last: 'http://api.test.com/last',
      next: 'http://api.test.com/next',
      prev: null,
    },
  };

  const mockCedarRecords = [mockCedarRecord];

  const mockActivatedRoute = {
    snapshot: {
      params: {},
    },
    parent: {
      parent: {
        snapshot: {
          params: { id: mockRegistryId },
        },
      },
    },
  };

  beforeEach(async () => {
    const mockToastService = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        RegistryMetadataAddComponent,
        MockComponent(SubHeaderComponent),
        MockComponent(CedarTemplateFormComponent),
        MockComponent(LoadingSpinnerComponent),
        MockPipe(TranslatePipe),
      ],
      providers: [
        provideStore([RegistryMetadataState]),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ToastService, useValue: mockToastService },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    toastService = TestBed.inject(ToastService);

    store.reset({
      registryMetadata: {
        cedarRecords: { data: mockCedarRecords, isLoading: false, error: null },
        cedarTemplates: { data: mockCedarTemplates, isLoading: false, error: null },
        cedarRecord: { data: null, isLoading: false, error: null },
      },
    });

    fixture = TestBed.createComponent(RegistryMetadataAddComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize with registryId from route params', () => {
      component.ngOnInit();
      expect(component['registryId']).toBe(mockRegistryId);
    });

    it('should dispatch actions when registryId is available', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });

    it('should not dispatch actions when registryId is not available', () => {
      component['route'].parent!.parent!.snapshot.params['id'] = undefined;
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.ngOnInit();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('constructor effect', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle record-id in route params for editing existing record', () => {
      activatedRoute.snapshot.params = { 'record-id': mockRecordId };

      const newFixture = TestBed.createComponent(RegistryMetadataAddComponent);
      newFixture.detectChanges();
      const newComponent = newFixture.componentInstance;

      expect(newComponent.existingRecord()).toEqual(mockCedarRecord);
      expect(newComponent.selectedTemplate()).toEqual(mockCedarTemplate);
      expect(newComponent.isEditMode).toBe(false);
    });

    it('should handle no record-id in route params for creating new record', () => {
      activatedRoute.snapshot.params = {};

      const newFixture = TestBed.createComponent(RegistryMetadataAddComponent);
      newFixture.detectChanges();
      const newComponent = newFixture.componentInstance;

      expect(newComponent.existingRecord()).toBeNull();
      expect(newComponent.selectedTemplate()).toBeNull();
      expect(newComponent.isEditMode).toBe(true);
    });
  });

  describe('hasMultiplePages', () => {
    it('should return true when first and last links are different', () => {
      expect(component.hasMultiplePages()).toBe(true);
    });

    it('should return false when first and last links are the same', () => {
      store.reset({
        registryMetadata: {
          cedarTemplates: {
            data: {
              ...mockCedarTemplates,
              links: { first: 'same', last: 'same' },
            },
            isLoading: false,
            error: null,
          },
        },
      });
      fixture.detectChanges();

      expect(component.hasMultiplePages()).toBe(false);
    });

    it('should return false when templates are null', () => {
      store.reset({
        registryMetadata: {
          cedarTemplates: { data: null, isLoading: false, error: null },
        },
      });
      fixture.detectChanges();

      expect(component.hasMultiplePages()).toBe(false);
    });
  });

  describe('hasNextPage', () => {
    it('should return true when next link exists', () => {
      expect(component.hasNextPage()).toBe(true);
    });

    it('should return false when next link does not exist', () => {
      store.reset({
        registryMetadata: {
          cedarTemplates: {
            data: {
              ...mockCedarTemplates,
              links: { ...mockCedarTemplates.links, next: null },
            },
            isLoading: false,
            error: null,
          },
        },
      });
      fixture.detectChanges();

      expect(component.hasNextPage()).toBe(false);
    });
  });

  describe('hasExistingRecord', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return true when record with template id exists', () => {
      const result = component.hasExistingRecord('template-1');
      expect(result).toBe(true);
    });

    it('should return false when no record with template id exists', () => {
      const result = component.hasExistingRecord('non-existent-template');
      expect(result).toBe(false);
    });

    it('should return false when records are null', () => {
      store.reset({
        registryMetadata: {
          cedarRecords: { data: null, isLoading: false, error: null },
        },
      });
      fixture.detectChanges();

      const result = component.hasExistingRecord('template-1');
      expect(result).toBe(false);
    });
  });

  describe('onTemplateSelected', () => {
    it('should set selected template', () => {
      component.onTemplateSelected(mockCedarTemplate);
      expect(component.selectedTemplate()).toEqual(mockCedarTemplate);
    });
  });

  describe('onSubmit', () => {
    const mockSubmissionData: CedarRecordDataBinding = {
      data: {
        '@context': {},
        Constructs: [],
        Assessments: [],
        Organization: [],
        'Project Name': { '@value': 'Test Project' },
        LDbaseWebsite: {},
        'Project Methods': [],
        'Participant Types': [],
        'Special Populations': [],
        'Developmental Design': {},
        LDbaseProjectEndDate: { '@type': 'xsd:date', '@value': '2024-12-31' },
        'Educational Curricula': [],
        LDbaseInvestigatorORCID: [],
        LDbaseProjectStartDates: { '@type': 'xsd:date', '@value': '2024-01-01' },
        'Educational Environments': {},
        LDbaseProjectDescription: { '@value': 'Test Description' },
        LDbaseProjectContributors: [],
      },
      id: 'template-1',
    };

    const mockMappedRecord: CedarMetadataRecord = {
      data: {
        type: 'cedar_metadata_records',
        attributes: {
          metadata: mockSubmissionData.data,
          is_published: false,
        },
        relationships: {
          template: {
            data: {
              type: 'cedar-metadata-templates',
              id: mockSubmissionData.id,
            },
          },
          target: {
            data: {
              type: 'registrations',
              id: mockRegistryId,
            },
          },
        },
      },
    };

    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
      (CedarFormMapper as jest.Mock).mockReturnValue(mockMappedRecord);
    });

    it('should not submit when registryId is not available', () => {
      component['registryId'] = '';
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onSubmit(mockSubmissionData);

      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(component.isSubmitting()).toBe(false);
    });

    it('should successfully create cedar record', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch').mockReturnValue(of());

      store.reset({
        registryMetadata: {
          cedarRecord: {
            data: { data: { id: 'new-record-id' } },
            isLoading: false,
            error: null,
          },
        },
      });

      component.onSubmit(mockSubmissionData);

      expect(component.isSubmitting()).toBe(true);
      expect(CedarFormMapper).toHaveBeenCalledWith(mockSubmissionData, mockRegistryId);
      expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should handle submission success', (done) => {
      const routerSpy = jest.spyOn(router, 'navigate');

      store.reset({
        registryMetadata: {
          cedarRecord: {
            data: { data: { id: 'new-record-id' } },
            isLoading: false,
            error: null,
          },
        },
      });

      component.onSubmit(mockSubmissionData);

      setTimeout(() => {
        expect(component.isSubmitting()).toBe(false);
        expect(toastService.showSuccess).toHaveBeenCalledWith(
          'project.overview.metadata.cedarRecordCreatedSuccessfully'
        );
        expect(routerSpy).toHaveBeenCalledWith(['../metadata', 'new-record-id'], {
          relativeTo: activatedRoute.parent,
        });
        done();
      }, 0);
    });

    it('should handle submission error', (done) => {
      component.onSubmit(mockSubmissionData);

      setTimeout(() => {
        expect(component.isSubmitting()).toBe(false);
        expect(toastService.showError).toHaveBeenCalledWith('project.overview.metadata.failedToCreateCedarRecord');
        done();
      }, 0);
    });
  });

  describe('onChangeTemplate', () => {
    it('should reset selected template', () => {
      component.selectedTemplate.set(mockCedarTemplate);
      component.onChangeTemplate();
      expect(component.selectedTemplate()).toBeNull();
    });
  });

  describe('toggleEditMode', () => {
    it('should toggle edit mode', () => {
      const initialMode = component.isEditMode;
      component.toggleEditMode();
      expect(component.isEditMode).toBe(!initialMode);
    });
  });

  describe('onNext', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should dispatch action with next link when available', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onNext();

      expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should not dispatch action when next link is not available', () => {
      store.reset({
        registryMetadata: {
          cedarTemplates: {
            data: {
              ...mockCedarTemplates,
              links: { ...mockCedarTemplates.links, next: null },
            },
            isLoading: false,
            error: null,
          },
        },
      });
      fixture.detectChanges();

      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onNext();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should dispatch getCedarTemplates when multiple pages exist', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onCancel();

      expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should navigate back when single page', () => {
      store.reset({
        registryMetadata: {
          cedarTemplates: {
            data: {
              ...mockCedarTemplates,
              links: { first: 'same', last: 'same' },
            },
            isLoading: false,
            error: null,
          },
        },
      });
      fixture.detectChanges();

      const routerSpy = jest.spyOn(router, 'navigate');

      component.onCancel();

      expect(routerSpy).toHaveBeenCalledWith(['..'], { relativeTo: activatedRoute });
    });

    it('should navigate back when templates are null', () => {
      store.reset({
        registryMetadata: {
          cedarTemplates: { data: null, isLoading: false, error: null },
        },
      });
      fixture.detectChanges();

      const routerSpy = jest.spyOn(router, 'navigate');

      component.onCancel();

      expect(routerSpy).toHaveBeenCalledWith(['..'], { relativeTo: activatedRoute });
    });
  });
});
