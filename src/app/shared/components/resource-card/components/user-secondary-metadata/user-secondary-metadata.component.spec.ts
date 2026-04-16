import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceType } from '@shared/enums/resource-type.enum';
import { ResourceModel } from '@shared/models/search/resource.model';

import { MOCK_AGENT_RESOURCE } from '@testing/mocks/resource.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { UserSecondaryMetadataComponent } from './user-secondary-metadata.component';

describe('UserSecondaryMetadataComponent', () => {
  let component: UserSecondaryMetadataComponent;
  let fixture: ComponentFixture<UserSecondaryMetadataComponent>;

  const mockResource: ResourceModel = {
    ...MOCK_AGENT_RESOURCE,
    resourceType: ResourceType.Agent,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserSecondaryMetadataComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(UserSecondaryMetadataComponent);
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
