import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_RESOURCE_OVERVIEW } from '@shared/mocks';
import { ResourceOverview } from '@shared/models';

import { ResourceMetadataComponent } from './resource-metadata.component';

describe('ResourceMetadataComponent', () => {
  let component: ResourceMetadataComponent;
  let fixture: ComponentFixture<ResourceMetadataComponent>;

  const mockResourceOverview: ResourceOverview = MOCK_RESOURCE_OVERVIEW;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceMetadataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceMetadataComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have currentResource as required input', () => {
    fixture.componentRef.setInput('currentResource', mockResourceOverview);
    expect(component.currentResource()).toEqual(mockResourceOverview);
  });

  it('should have canWrite as required input', () => {
    fixture.componentRef.setInput('canWrite', true);
    expect(component.canWrite()).toBe(true);
  });

  it('should have customCitationUpdated output', () => {
    expect(component.customCitationUpdated).toBeDefined();
  });

  it('should emit customCitationUpdated when onCustomCitationUpdated is called', () => {
    const customCitationSpy = jest.fn();
    component.customCitationUpdated.subscribe(customCitationSpy);

    const testCitation = 'New custom citation text';
    component.onCustomCitationUpdated(testCitation);

    expect(customCitationSpy).toHaveBeenCalledWith(testCitation);
  });

  it('should handle onCustomCitationUpdated method with empty string', () => {
    const customCitationSpy = jest.fn();
    component.customCitationUpdated.subscribe(customCitationSpy);

    component.onCustomCitationUpdated('');

    expect(customCitationSpy).toHaveBeenCalledWith('');
  });

  it('should handle null currentResource input', () => {
    fixture.componentRef.setInput('currentResource', null);
    expect(component.currentResource()).toBeNull();
  });

  it('should handle false canWrite input', () => {
    fixture.componentRef.setInput('canWrite', false);
    expect(component.canWrite()).toBe(false);
  });

  it('should handle true isCollectionsRoute input', () => {
    fixture.componentRef.setInput('isCollectionsRoute', true);
    expect(component.isCollectionsRoute()).toBe(true);
  });
});
