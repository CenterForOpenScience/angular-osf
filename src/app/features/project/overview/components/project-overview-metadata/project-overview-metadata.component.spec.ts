import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

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

import { MOCK_PROJECT_OVERVIEW } from '@testing/mocks/project-overview.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

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

describe('ProjectOverviewMetadataComponent', () => {
  let component: ProjectOverviewMetadataComponent;
  let fixture: ComponentFixture<ProjectOverviewMetadataComponent>;
  let store: Store;
  let dispatchMock: Mock;
  let mockRouter: RouterMockType;

  interface SetupOverrides {
    project?: typeof MOCK_PROJECT_OVERVIEW | null;
  }

  function setup(overrides: SetupOverrides = {}) {
    const project = 'project' in overrides ? overrides.project : MOCK_PROJECT_OVERVIEW;
    mockRouter = RouterMockBuilder.create().withUrl('/project/project-1/overview').build();

    TestBed.configureTestingModule({
      imports: [
        ProjectOverviewMetadataComponent,
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
        provideOSFCore(),
        MockProvider(Router, mockRouter),
        provideMockStore({
          signals: [
            { selector: ProjectOverviewSelectors.getProject, value: project },
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
      ],
    });

    store = TestBed.inject(Store);
    dispatchMock = store.dispatch as Mock;
    fixture = TestBed.createComponent(ProjectOverviewMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should dispatch init actions when project exists', () => {
    setup();

    expect(dispatchMock).toHaveBeenCalledWith(new GetBibliographicContributors('project-1', ResourceType.Project));
    expect(dispatchMock).toHaveBeenCalledWith(new GetProjectInstitutions('project-1'));
    expect(dispatchMock).toHaveBeenCalledWith(new GetProjectIdentifiers('project-1'));
    expect(dispatchMock).toHaveBeenCalledWith(new GetProjectPreprints('project-1'));
    expect(dispatchMock).toHaveBeenCalledWith(new FetchSelectedSubjects('project-1', ResourceType.Project));
    expect(dispatchMock).toHaveBeenCalledWith(new GetProjectSubmissions('project-1'));
    expect(dispatchMock).toHaveBeenCalledWith(new GetProjectLicense(MOCK_PROJECT_OVERVIEW.licenseId));
  });

  it('should not dispatch init actions when project is null', () => {
    setup({ project: null });

    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('should dispatch custom citation update', () => {
    setup();
    dispatchMock.mockClear();

    component.onCustomCitationUpdated('My custom citation');

    expect(dispatchMock).toHaveBeenCalledWith(new SetProjectCustomCitation('My custom citation'));
  });

  it('should dispatch load more contributors with current project id', () => {
    setup();
    dispatchMock.mockClear();

    component.handleLoadMoreContributors();

    expect(dispatchMock).toHaveBeenCalledWith(new LoadMoreBibliographicContributors('project-1', ResourceType.Project));
  });

  it('should dispatch load more contributors with undefined project id when project is missing', () => {
    setup({ project: null });
    dispatchMock.mockClear();

    component.handleLoadMoreContributors();

    expect(dispatchMock).toHaveBeenCalledWith(
      new LoadMoreBibliographicContributors(undefined as unknown as string, ResourceType.Project)
    );
  });

  it('should navigate to search when clicking a tag', () => {
    setup();

    component.tagClicked('open-science');

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/search'], { queryParams: { search: 'open-science' } });
  });

  it('should expose static view config values', () => {
    setup();

    expect(component.resourceType).toBe(CurrentResourceType.Projects);
    expect(component.dateFormat).toBe('MMM d, y, h:mm a');
  });
});
