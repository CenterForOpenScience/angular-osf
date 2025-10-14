import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceType } from '@shared/enums';
import { ResourceModel } from '@shared/models';

import { FileSecondaryMetadataComponent } from './file-secondary-metadata.component';

import { MOCK_RESOURCE } from '@testing/mocks';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('FileSecondaryMetadataComponent', () => {
  let component: FileSecondaryMetadataComponent;
  let fixture: ComponentFixture<FileSecondaryMetadataComponent>;

  const mockResource: ResourceModel = {
    ...MOCK_RESOURCE,
    resourceType: ResourceType.File,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileSecondaryMetadataComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FileSecondaryMetadataComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('resource', mockResource);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should have resource as required input', () => {
    fixture.componentRef.setInput('resource', mockResource);
    fixture.detectChanges();

    expect(component.resource()).toEqual(mockResource);
  });

  it('should update when resource input changes', () => {
    fixture.componentRef.setInput('resource', mockResource);
    fixture.detectChanges();

    const updatedResource: ResourceModel = {
      ...mockResource,
      description: 'Updated description',
    };

    fixture.componentRef.setInput('resource', updatedResource);
    fixture.detectChanges();

    expect(component.resource()).toEqual(updatedResource);
    expect(component.resource().description).toBe('Updated description');
  });
});
