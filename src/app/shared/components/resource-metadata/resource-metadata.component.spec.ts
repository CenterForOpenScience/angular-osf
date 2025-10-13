import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceOverview } from '@shared/models';

import { ResourceMetadataComponent } from './resource-metadata.component';

import { MOCK_RESOURCE_OVERVIEW } from '@testing/mocks';

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

  it('should have canEdit as required input', () => {
    fixture.componentRef.setInput('canEdit', true);
    expect(component.canEdit()).toBe(true);
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

  it('should handle false canEdit input', () => {
    fixture.componentRef.setInput('canEdit', false);
    expect(component.canEdit()).toBe(false);
  });

  it('should handle true isCollectionsRoute input', () => {
    fixture.componentRef.setInput('isCollectionsRoute', true);
    expect(component.isCollectionsRoute()).toBe(true);
  });
});
