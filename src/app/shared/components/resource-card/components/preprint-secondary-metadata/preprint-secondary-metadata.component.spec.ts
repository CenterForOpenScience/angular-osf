import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceType } from '@shared/enums/resource-type.enum';
import { ResourceModel } from '@shared/models/search/resource.model';

import { PreprintSecondaryMetadataComponent } from './preprint-secondary-metadata.component';

import { MOCK_RESOURCE } from '@testing/mocks/resource.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('PreprintSecondaryMetadataComponent', () => {
  let component: PreprintSecondaryMetadataComponent;
  let fixture: ComponentFixture<PreprintSecondaryMetadataComponent>;

  const mockResource: ResourceModel = {
    ...MOCK_RESOURCE,
    resourceType: ResourceType.Preprint,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintSecondaryMetadataComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintSecondaryMetadataComponent);
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
