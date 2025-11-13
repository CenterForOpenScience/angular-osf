import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatedInstitutionsViewComponent } from '@osf/features/project/overview/components/affiliated-institutions-view/affiliated-institutions-view.component';
import { ContributorsListComponent } from '@osf/features/project/overview/components/contributors-list/contributors-list.component';
import { OverviewCollectionsComponent } from '@osf/features/project/overview/components/overview-collections/overview-collections.component';
import { ResourceCitationsComponent } from '@osf/features/project/overview/components/resource-citations/resource-citations.component';
import { ProjectOverviewMetadataComponent } from '@osf/features/project/overview/components/resource-metadata/resource-metadata.component';
import { TruncatedTextComponent } from '@osf/features/project/overview/components/truncated-text/truncated-text.component';
import { ResourceOverview } from '@osf/shared/models/resource-overview.model';

import { MOCK_RESOURCE_OVERVIEW } from '@testing/mocks/resource.mock';

describe('ProjectOverviewMetadataComponent', () => {
  let component: ProjectOverviewMetadataComponent;
  let fixture: ComponentFixture<ProjectOverviewMetadataComponent>;

  const mockResourceOverview: ResourceOverview = MOCK_RESOURCE_OVERVIEW;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProjectOverviewMetadataComponent,
        MockComponents(
          TruncatedTextComponent,
          ResourceCitationsComponent,
          OverviewCollectionsComponent,
          AffiliatedInstitutionsViewComponent,
          ContributorsListComponent
        ),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectOverviewMetadataComponent);
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
});
