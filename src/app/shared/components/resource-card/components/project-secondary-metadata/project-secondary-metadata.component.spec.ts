import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceType } from '@shared/enums';
import { MOCK_RESOURCE } from '@shared/mocks';
import { ResourceModel } from '@shared/models';

import { ProjectSecondaryMetadataComponent } from './project-secondary-metadata.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ProjectSecondaryMetadataComponent', () => {
  let component: ProjectSecondaryMetadataComponent;
  let fixture: ComponentFixture<ProjectSecondaryMetadataComponent>;

  const mockResource: ResourceModel = {
    ...MOCK_RESOURCE,
    resourceType: ResourceType.Project,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSecondaryMetadataComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectSecondaryMetadataComponent);
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
