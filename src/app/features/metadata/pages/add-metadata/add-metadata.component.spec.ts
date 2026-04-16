import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ToastService } from '@osf/shared/services/toast.service';

import { CEDAR_METADATA_DATA_TEMPLATE_JSON_API_MOCK } from '@testing/mocks/cedar-metadata-data-template-json-api.mock';
import { MOCK_CEDAR_METADATA_RECORD_DATA } from '@testing/mocks/cedar-metadata-record.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

import { CedarTemplateFormComponent } from '../../components/cedar-template-form/cedar-template-form.component';
import { MetadataSelectors } from '../../store';

import { AddMetadataComponent } from './add-metadata.component';

describe('AddMetadataComponent', () => {
  let component: AddMetadataComponent;
  let fixture: ComponentFixture<AddMetadataComponent>;
  let router: Partial<Router>;
  let activatedRoute: Partial<ActivatedRoute>;
  let toastService: ReturnType<ToastServiceMockBuilder['build']>;

  const mockTemplate = CEDAR_METADATA_DATA_TEMPLATE_JSON_API_MOCK;
  const mockRecord = MOCK_CEDAR_METADATA_RECORD_DATA;

  const mockCedarTemplates = {
    data: [mockTemplate],
    links: {
      first: 'http://example.com/first',
      last: 'http://example.com/last',
      next: 'http://example.com/next',
      prev: null,
    },
  };

  const mockCedarRecords = [mockRecord];

  beforeEach(() => {
    toastService = ToastServiceMock.simple();

    router = {
      navigate: vi.fn(),
    };

    const baseRoute = ActivatedRouteMockBuilder.create().build();
    activatedRoute = {
      ...baseRoute,
      parent: {
        ...baseRoute.parent,
        snapshot: {
          data: { resourceType: ResourceType.Project },
          params: {},
        },
        parent: {
          snapshot: {
            params: { id: 'resource-1' },
          },
        },
      } as any,
    };

    TestBed.configureTestingModule({
      imports: [
        AddMetadataComponent,
        ...MockComponents(SubHeaderComponent, CedarTemplateFormComponent, LoadingSpinnerComponent),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(Router, router),
        MockProvider(ActivatedRoute, activatedRoute),
        MockProvider(ToastService, toastService),
        provideMockStore({
          signals: [
            { selector: MetadataSelectors.getCedarTemplates, value: mockCedarTemplates },
            { selector: MetadataSelectors.getCedarRecords, value: mockCedarRecords },
            { selector: MetadataSelectors.getCedarTemplatesLoading, value: false },
            { selector: MetadataSelectors.getCedarRecord, value: { data: mockRecord } },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(AddMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct resource type', () => {
    expect(component.resourceType()).toBe(ResourceType.Project);
  });

  it('should not select a template if existing record exists', () => {
    component.selectedTemplate = null;
    component.onSelect(mockTemplate);

    expect(component.selectedTemplate).toBeNull();
  });

  it('should call onNext when next page exists', () => {
    const hasNext = component.hasNextPage();

    expect(hasNext).toBe(true);
  });

  it('should return true when next link exists', () => {
    expect(component.hasNextPage()).toBe(true);
  });

  it('should return true when first and last links are different', () => {
    expect(component.hasMultiplePages()).toBe(true);
  });

  it('should clear selected template', () => {
    component.selectedTemplate = mockTemplate;

    component.disableSelect();

    expect(component.selectedTemplate).toBeNull();
  });

  it('should return true if record exists for template', () => {
    expect(component.hasExistingRecord('template-1')).toBe(true);
  });

  it('should return false if no record exists for template', () => {
    expect(component.hasExistingRecord('template-2')).toBe(false);
  });

  it('should have existingRecord as null initially', () => {
    expect(component.existingRecord).toBeNull();
  });

  it('should toggle edit mode from true to false', () => {
    component.isEditMode = true;

    component.toggleEditMode();

    expect(component.isEditMode).toBe(false);
  });

  it('should toggle edit mode from false to true', () => {
    component.isEditMode = false;

    component.toggleEditMode();

    expect(component.isEditMode).toBe(true);
  });

  it('should have correct initial state for edit mode', () => {
    expect(component.isEditMode).toBe(true);
  });
});
