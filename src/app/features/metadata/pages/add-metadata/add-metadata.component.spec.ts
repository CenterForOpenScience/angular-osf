import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { CedarTemplateFormComponent } from '@osf/features/metadata/components';
import { ResourceType } from '@osf/shared/enums';
import { ToastService } from '@osf/shared/services';
import { LoadingSpinnerComponent, SubHeaderComponent } from '@shared/components';
import { CEDAR_METADATA_DATA_TEMPLATE_JSON_API_MOCK } from '@shared/mocks';

import { CedarMetadataDataTemplateJsonApi } from '../../models';
import { MetadataSelectors } from '../../store';

import { AddMetadataComponent } from './add-metadata.component';

import { MOCK_CEDAR_METADATA_RECORD_DATA } from '@testing/mocks/cedar-metadata-record.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('AddMetadataComponent', () => {
  let component: AddMetadataComponent;
  let fixture: ComponentFixture<AddMetadataComponent>;
  let router: Partial<Router>;
  let activatedRoute: Partial<ActivatedRoute>;
  let toastService: ReturnType<ToastServiceMockBuilder['build']>;

  const mockTemplate: CedarMetadataDataTemplateJsonApi = CEDAR_METADATA_DATA_TEMPLATE_JSON_API_MOCK;
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

  beforeEach(async () => {
    toastService = ToastServiceMockBuilder.create().build();

    router = {
      navigate: jest.fn(),
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

    await TestBed.configureTestingModule({
      imports: [
        AddMetadataComponent,
        OSFTestingModule,
        ...MockComponents(SubHeaderComponent, CedarTemplateFormComponent, LoadingSpinnerComponent),
      ],
      providers: [
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
    }).compileComponents();

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
