import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationBlocksDataComponent } from '@osf/shared/components/registration-blocks-data/registration-blocks-data.component';

import { RegistryBlocksSectionComponent } from './registry-blocks-section.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('RegistryBlocksSectionComponent', () => {
  let component: RegistryBlocksSectionComponent;
  let fixture: ComponentFixture<RegistryBlocksSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryBlocksSectionComponent, OSFTestingModule, ...MockComponents(RegistrationBlocksDataComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryBlocksSectionComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('schemaBlocks', []);
    fixture.componentRef.setInput('isSchemaBlocksLoading', false);
    fixture.componentRef.setInput('isSchemaResponsesLoading', false);
    fixture.componentRef.setInput('schemaResponse', null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute updatedFields from schemaResponse', () => {
    const mockSchemaResponse = {
      id: 'test-id',
      dateCreated: '2024-01-01',
      dateSubmitted: null,
      dateModified: '2024-01-01',
      revisionJustification: 'test',
      revisionResponses: {},
      updatedResponseKeys: ['key1', 'key2'],
      reviewsState: 'pending' as any,
      isPendingCurrentUserApproval: false,
      isOriginalResponse: true,
      registrationSchemaId: 'schema-id',
      registrationId: 'reg-id',
    };

    fixture.componentRef.setInput('schemaResponse', mockSchemaResponse);
    fixture.detectChanges();

    expect(component.updatedFields()).toEqual(['key1', 'key2']);
  });

  it('should return empty array when schemaResponse is null', () => {
    fixture.componentRef.setInput('schemaResponse', null);
    fixture.detectChanges();

    expect(component.updatedFields()).toEqual([]);
  });
});
