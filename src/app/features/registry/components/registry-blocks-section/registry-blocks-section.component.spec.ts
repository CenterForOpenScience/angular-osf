import { MockComponent } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';

import { RegistrationBlocksDataComponent } from '@osf/shared/components/registration-blocks-data/registration-blocks-data.component';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';

import { RegistryBlocksSectionComponent } from './registry-blocks-section.component';

import { createMockPageSchema } from '@testing/mocks/page-schema.mock';
import { createMockSchemaResponse } from '@testing/mocks/schema-response.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

describe('RegistryBlocksSectionComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegistryBlocksSectionComponent, MockComponent(RegistrationBlocksDataComponent)],
      providers: [provideOSFCore()],
    });
  });

  it('should create with required inputs', () => {
    const fixture = TestBed.createComponent(RegistryBlocksSectionComponent);
    fixture.componentRef.setInput('schemaBlocks', [createMockPageSchema()]);
    fixture.componentRef.setInput('schemaResponse', null);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.isLoading()).toBe(false);
  });

  it('should compute updatedFields from schemaResponse', () => {
    const fixture = TestBed.createComponent(RegistryBlocksSectionComponent);
    const mockResponse = createMockSchemaResponse('response-1', RevisionReviewStates.Approved);
    mockResponse.updatedResponseKeys = ['key1', 'key2'];

    fixture.componentRef.setInput('schemaBlocks', []);
    fixture.componentRef.setInput('schemaResponse', mockResponse);
    fixture.detectChanges();

    expect(fixture.componentInstance.updatedFields()).toEqual(['key1', 'key2']);
  });

  it('should return empty updatedFields when schemaResponse is null', () => {
    const fixture = TestBed.createComponent(RegistryBlocksSectionComponent);
    fixture.componentRef.setInput('schemaBlocks', []);
    fixture.componentRef.setInput('schemaResponse', null);
    fixture.detectChanges();

    expect(fixture.componentInstance.updatedFields()).toEqual([]);
  });
});
