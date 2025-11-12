import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AffiliatedInstitutionsViewComponent } from '@osf/shared/components/affiliated-institutions-view/affiliated-institutions-view.component';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { ResourceCitationsComponent } from '@osf/shared/components/resource-citations/resource-citations.component';
import { ResourceDoiComponent } from '@osf/shared/components/resource-doi/resource-doi.component';
import { ResourceLicenseComponent } from '@osf/shared/components/resource-license/resource-license.component';
import { SubjectsListComponent } from '@osf/shared/components/subjects-list/subjects-list.component';
import { TagsListComponent } from '@osf/shared/components/tags-list/tags-list.component';
import { CurrentResourceType, ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CollectionsSelectors, GetProjectSubmissions } from '@osf/shared/stores/collections';
import {
  ContributorsSelectors,
  GetBibliographicContributors,
  LoadMoreBibliographicContributors,
} from '@osf/shared/stores/contributors';
import { FetchSelectedSubjects, SubjectsSelectors } from '@osf/shared/stores/subjects';

import {
  GetProjectIdentifiers,
  GetProjectInstitutions,
  GetProjectLicense,
  GetProjectPreprints,
  ProjectOverviewSelectors,
  SetProjectCustomCitation,
} from '../../store';
import { OverviewCollectionsComponent } from '../overview-collections/overview-collections.component';
import { OverviewSupplementsComponent } from '../overview-supplements/overview-supplements.component';

import { ProjectOverviewMetadataComponent } from './project-overview-metadata.component';

import { MOCK_PROJECT_OVERVIEW } from '@testing/mocks/project-overview.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('ProjectOverviewMetadataComponent', () => {
  let component: ProjectOverviewMetadataComponent;
  let fixture: ComponentFixture<ProjectOverviewMetadataComponent>;
  let store: jest.Mocked<Store>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;

  const mockProject = {
    ...MOCK_PROJECT_OVERVIEW,
    id: 'project-123',
    licenseId: 'license-123',
  };

  beforeEach(async () => {
    routerMock = RouterMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        ProjectOverviewMetadataComponent,
        OSFTestingModule,
        ...MockComponents(
          ResourceCitationsComponent,
          OverviewCollectionsComponent,
          AffiliatedInstitutionsViewComponent,
          ContributorsListComponent,
          ResourceDoiComponent,
          ResourceLicenseComponent,
          SubjectsListComponent,
          TagsListComponent,
          OverviewSupplementsComponent
        ),
      ],
      providers: [
        provideMockStore({
          signals: [
            { selector: ProjectOverviewSelectors.getProject, value: mockProject },
            { selector: ProjectOverviewSelectors.isProjectAnonymous, value: false },
            { selector: ProjectOverviewSelectors.hasWriteAccess, value: true },
            { selector: ProjectOverviewSelectors.getInstitutions, value: [] },
            { selector: ProjectOverviewSelectors.isInstitutionsLoading, value: false },
            { selector: ProjectOverviewSelectors.getIdentifiers, value: [] },
            { selector: ProjectOverviewSelectors.isIdentifiersLoading, value: false },
            { selector: ProjectOverviewSelectors.getLicense, value: null },
            { selector: ProjectOverviewSelectors.isLicenseLoading, value: false },
            { selector: ProjectOverviewSelectors.getPreprints, value: [] },
            { selector: ProjectOverviewSelectors.isPreprintsLoading, value: false },
            { selector: SubjectsSelectors.getSelectedSubjects, value: [] },
            { selector: SubjectsSelectors.areSelectedSubjectsLoading, value: false },
            { selector: ContributorsSelectors.getBibliographicContributors, value: [] },
            { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: false },
            { selector: ContributorsSelectors.hasMoreBibliographicContributors, value: false },
            { selector: CollectionsSelectors.getCurrentProjectSubmissions, value: [] },
            { selector: CollectionsSelectors.getCurrentProjectSubmissionsLoading, value: false },
          ],
        }),
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as jest.Mocked<Store>;
    store.dispatch = jest.fn().mockReturnValue(of(true));
    fixture = TestBed.createComponent(ProjectOverviewMetadataComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties', () => {
    it('should have resourceType set to Projects', () => {
      expect(component.resourceType).toBe(CurrentResourceType.Projects);
    });

    it('should have correct dateFormat', () => {
      expect(component.dateFormat).toBe('MMM d, y, h:mm a');
    });
  });

  describe('Effects', () => {
    it('should dispatch actions when project exists', () => {
      fixture.detectChanges();

      expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetBibliographicContributors));
      expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetProjectInstitutions));
      expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetProjectIdentifiers));
      expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetProjectPreprints));
      expect(store.dispatch).toHaveBeenCalledWith(expect.any(FetchSelectedSubjects));
      expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetProjectSubmissions));
      expect(store.dispatch).toHaveBeenCalledWith(expect.any(GetProjectLicense));
    });

    it('should dispatch GetBibliographicContributors with correct parameters', () => {
      fixture.detectChanges();

      const call = (store.dispatch as jest.Mock).mock.calls.find(
        (call) => call[0] instanceof GetBibliographicContributors
      );
      expect(call).toBeDefined();
      const action = call[0] as GetBibliographicContributors;
      expect(action.resourceId).toBe('project-123');
      expect(action.resourceType).toBe(ResourceType.Project);
    });

    it('should dispatch GetProjectLicense with licenseId from project', () => {
      fixture.detectChanges();

      const call = (store.dispatch as jest.Mock).mock.calls.find((call) => call[0] instanceof GetProjectLicense);
      expect(call).toBeDefined();
      const action = call[0] as GetProjectLicense;
      expect(action.licenseId).toBe('license-123');
    });
  });

  describe('onCustomCitationUpdated', () => {
    it('should dispatch SetProjectCustomCitation with citation', () => {
      const citation = 'Custom Citation Text';
      component.onCustomCitationUpdated(citation);

      expect(store.dispatch).toHaveBeenCalledWith(expect.any(SetProjectCustomCitation));
      const call = (store.dispatch as jest.Mock).mock.calls.find((call) => call[0] instanceof SetProjectCustomCitation);
      expect(call).toBeDefined();
      const action = call[0] as SetProjectCustomCitation;
      expect(action.citation).toBe(citation);
    });
  });

  describe('handleLoadMoreContributors', () => {
    it('should dispatch LoadMoreBibliographicContributors with project id', () => {
      component.handleLoadMoreContributors();

      expect(store.dispatch).toHaveBeenCalledWith(expect.any(LoadMoreBibliographicContributors));
      const call = (store.dispatch as jest.Mock).mock.calls.find(
        (call) => call[0] instanceof LoadMoreBibliographicContributors
      );
      expect(call).toBeDefined();
      const action = call[0] as LoadMoreBibliographicContributors;
      expect(action.resourceId).toBe('project-123');
      expect(action.resourceType).toBe(ResourceType.Project);
    });
  });

  describe('tagClicked', () => {
    it('should navigate to search page with tag as query param', () => {
      const tag = 'test-tag';
      component.tagClicked(tag);

      expect(routerMock.navigate).toHaveBeenCalledWith(['/search'], { queryParams: { search: tag } });
    });
  });
});
