import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationBlocksDataComponent } from '@osf/shared/components/registration-blocks-data/registration-blocks-data.component';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { PageSchema } from '@osf/shared/models/registration/page-schema.model';

import { RegistryBlocksSectionComponent } from './registry-blocks-section.component';

import { createMockSchemaResponse } from '@testing/mocks/schema-response.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('RegistryBlocksSectionComponent', () => {
  let component: RegistryBlocksSectionComponent;
  let fixture: ComponentFixture<RegistryBlocksSectionComponent>;

  const mockPageSchema: PageSchema = {
    id: 'page-1',
    title: 'Test Page',
    description: 'Test description',
    questions: [
      {
        id: 'question-1',
        displayText: 'Test Question',
        required: false,
      },
    ],
    sections: [
      {
        id: 'section-1',
        title: 'Test Section',
        description: 'Section description',
        questions: [
          {
            id: 'section-question-1',
            displayText: 'Section Question',
            required: true,
          },
        ],
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryBlocksSectionComponent, OSFTestingModule, MockComponent(RegistrationBlocksDataComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryBlocksSectionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('schemaBlocks', []);
    fixture.componentRef.setInput('schemaResponse', null);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set schemaBlocks input correctly', () => {
    const mockBlocks: PageSchema[] = [mockPageSchema];
    fixture.componentRef.setInput('schemaBlocks', mockBlocks);
    fixture.componentRef.setInput('schemaResponse', null);
    fixture.detectChanges();

    expect(component.schemaBlocks()).toEqual(mockBlocks);
  });

  it('should set schemaResponse input correctly', () => {
    const mockResponse = createMockSchemaResponse('response-1', RevisionReviewStates.Approved);
    fixture.componentRef.setInput('schemaBlocks', []);
    fixture.componentRef.setInput('schemaResponse', mockResponse);
    fixture.detectChanges();

    expect(component.schemaResponse()).toEqual(mockResponse);
  });

  it('should default isLoading to false', () => {
    fixture.componentRef.setInput('schemaBlocks', []);
    fixture.componentRef.setInput('schemaResponse', null);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
  });

  it('should compute updatedFields from schemaResponse with updatedResponseKeys', () => {
    const mockResponse = createMockSchemaResponse('response-1', RevisionReviewStates.Approved);
    mockResponse.updatedResponseKeys = ['key1', 'key2', 'key3'];
    fixture.componentRef.setInput('schemaBlocks', []);
    fixture.componentRef.setInput('schemaResponse', mockResponse);
    fixture.detectChanges();

    expect(component.updatedFields()).toEqual(['key1', 'key2', 'key3']);
  });

  it('should return empty array when schemaResponse is null', () => {
    fixture.componentRef.setInput('schemaBlocks', []);
    fixture.componentRef.setInput('schemaResponse', null);
    fixture.detectChanges();

    expect(component.updatedFields()).toEqual([]);
  });

  it('should handle single updatedResponseKey', () => {
    const mockResponse = createMockSchemaResponse('response-1', RevisionReviewStates.Approved);
    mockResponse.updatedResponseKeys = ['single-key'];
    fixture.componentRef.setInput('schemaBlocks', []);
    fixture.componentRef.setInput('schemaResponse', mockResponse);
    fixture.detectChanges();

    expect(component.updatedFields()).toEqual(['single-key']);
  });

  it('should initialize with all required inputs', () => {
    const mockBlocks: PageSchema[] = [mockPageSchema];
    const mockResponse = createMockSchemaResponse('response-1', RevisionReviewStates.Approved);

    fixture.componentRef.setInput('schemaBlocks', mockBlocks);
    fixture.componentRef.setInput('schemaResponse', mockResponse);
    fixture.detectChanges();

    expect(component.schemaBlocks()).toEqual(mockBlocks);
    expect(component.schemaResponse()).toEqual(mockResponse);
    expect(component.isLoading()).toBe(false);
  });

  it('should handle all inputs being set together', () => {
    const mockBlocks: PageSchema[] = [mockPageSchema];
    const mockResponse = createMockSchemaResponse('response-1', RevisionReviewStates.Approved);
    mockResponse.updatedResponseKeys = ['test-key'];

    fixture.componentRef.setInput('schemaBlocks', mockBlocks);
    fixture.componentRef.setInput('schemaResponse', mockResponse);
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(component.schemaBlocks()).toEqual(mockBlocks);
    expect(component.schemaResponse()).toEqual(mockResponse);
    expect(component.isLoading()).toBe(true);
    expect(component.updatedFields()).toEqual(['test-key']);
  });
});
