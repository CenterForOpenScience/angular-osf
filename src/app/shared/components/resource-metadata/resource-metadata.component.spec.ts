import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewCollectionsComponent } from '@osf/features/project/overview/components/overview-collections/overview-collections.component';
import { ResourceOverview } from '@shared/models/resource-overview.model';

import { AffiliatedInstitutionsViewComponent } from '../affiliated-institutions-view/affiliated-institutions-view.component';
import { ContributorsListComponent } from '../contributors-list/contributors-list.component';
import { ResourceCitationsComponent } from '../resource-citations/resource-citations.component';
import { TruncatedTextComponent } from '../truncated-text/truncated-text.component';

import { ResourceMetadataComponent } from './resource-metadata.component';

import { MOCK_RESOURCE_OVERVIEW } from '@testing/mocks/resource.mock';

describe('ResourceMetadataComponent', () => {
  let component: ResourceMetadataComponent;
  let fixture: ComponentFixture<ResourceMetadataComponent>;

  const mockResourceOverview: ResourceOverview = MOCK_RESOURCE_OVERVIEW;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ResourceMetadataComponent,
        MockComponents(
          TruncatedTextComponent,
          ResourceCitationsComponent,
          OverviewCollectionsComponent,
          AffiliatedInstitutionsViewComponent,
          ContributorsListComponent
        ),
      ],
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
