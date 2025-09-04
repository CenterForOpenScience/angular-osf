import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { ButtonGroupModule } from 'primeng/buttongroup';
import { DialogService } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { TagModule } from 'primeng/tag';

import { of } from 'rxjs';

import { DestroyRef, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CollectionSubmissionReviewAction } from '@osf/features/moderation/models';
import { CollectionsModerationSelectors } from '@osf/features/moderation/store/collections-moderation';
import { ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import {
  LoadingSpinnerComponent,
  ResourceMetadataComponent,
  SubHeaderComponent,
  ViewOnlyLinkMessageComponent,
} from '@osf/shared/components';
import { ToastService } from '@osf/shared/services';
import { MOCK_STORE } from '@shared/mocks';
import { Identifier } from '@shared/models';
import { DataciteService } from '@shared/services/datacite/datacite.service';
import {
  BookmarksSelectors,
  CitationsSelectors,
  CollectionsSelectors,
  MyResourcesSelectors,
  NodeLinksSelectors,
} from '@shared/stores';
import { ActivityLogsSelectors } from '@shared/stores/activity-logs';

import {
  LinkedResourcesComponent,
  OverviewComponentsComponent,
  OverviewToolbarComponent,
  OverviewWikiComponent,
  RecentActivityComponent,
} from './components';
import { ProjectOverviewComponent } from './project-overview.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

const sampleReviewAction: CollectionSubmissionReviewAction = {
  id: 'ra1',
  type: 'collection-submission-review-action',
  dateCreated: '2025-09-01T10:15:00Z',
  dateModified: '2025-09-01T10:30:00Z',
  fromState: 'pending',
  toState: 'accepted',
  comment: 'Submission approved by moderator',
  trigger: 'accept',
  targetId: 'sub123',
  targetNodeId: 'node456',
  createdBy: 'user789',
};

describe('ProjectOverviewComponent', () => {
  let fixture: ComponentFixture<ProjectOverviewComponent>;
  let dataciteService: jest.Mocked<DataciteService>;
  const projectSignal = signal<any>(getProject());

  const activatedRouteMock = {
    snapshot: {
      queryParams: {
        mode: 'moderation', // or whatever value you want to test
      },
      params: {
        id: '1234', // value for this.route.snapshot.params['id']
      },
      parent: {
        snapshot: {
          params: {
            id: '5678', // fallback if top-level param is undefined
          },
        },
      },
    },
  };

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case ProjectOverviewSelectors.getProject:
          return projectSignal;
        case CollectionsModerationSelectors.getCurrentReviewAction:
          return signal(sampleReviewAction);
        case ProjectOverviewSelectors.getProjectLoading:
        case CollectionsSelectors.getCollectionProviderLoading:
        case CollectionsModerationSelectors.getCurrentReviewActionLoading:
        case ProjectOverviewSelectors.isProjectAnonymous:
        case MyResourcesSelectors.getBookmarksLoading:
        case BookmarksSelectors.getBookmarksCollectionIdSubmitting:
        case ProjectOverviewSelectors.getComponentsLoading:
        case NodeLinksSelectors.getLinkedResourcesLoading:
        case ActivityLogsSelectors.getActivityLogsLoading:
          return () => false;
        case ActivityLogsSelectors.getActivityLogsTotalCount:
          return () => 0;
        case BookmarksSelectors.getBookmarksCollectionId:
          return () => '123';
        case MyResourcesSelectors.getBookmarks:
        case ActivityLogsSelectors.getActivityLogs:
        case CitationsSelectors.getCitationStyles:
        case ProjectOverviewSelectors.getComponents:
        case NodeLinksSelectors.getLinkedResources:
          return () => [];
        default:
          return () => '';
      }
    });

    dataciteService = {
      logView: jest.fn().mockReturnValue(of(void 0)),
    } as unknown as jest.Mocked<DataciteService>;

    await TestBed.configureTestingModule({
      imports: [
        ProjectOverviewComponent,
        OSFTestingModule,
        ButtonGroupModule,
        TagModule,
        SubHeaderComponent,
        FormsModule,
        LoadingSpinnerComponent,
        OverviewWikiComponent,
        OverviewComponentsComponent,
        LinkedResourcesComponent,
        RecentActivityComponent,
        OverviewToolbarComponent,
        ResourceMetadataComponent,
        TranslatePipe,
        Message,
        RouterLink,
        ViewOnlyLinkMessageComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Store, useValue: MOCK_STORE },
        { provide: DataciteService, useValue: dataciteService },
        Router,
        DestroyRef,
        MockProvider(ToastService),
        DialogService,
        TranslateService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectOverviewComponent);
    fixture.detectChanges();
  });

  it('reacts to sequence of state changes', () => {
    fixture.detectChanges();
    expect(dataciteService.logView).toHaveBeenCalledTimes(0);

    projectSignal.set(getProject());

    fixture.detectChanges();
    expect(dataciteService.logView).toHaveBeenCalledTimes(0);

    projectSignal.set(getProject([{ category: 'dio', value: '123', id: '', type: 'identifier' }]));
    fixture.detectChanges();
    expect(dataciteService.logView).toHaveBeenCalledTimes(0);

    projectSignal.set(getProject([{ category: 'doi', value: '123', id: '', type: 'identifier' }]));

    fixture.detectChanges();
    expect(dataciteService.logView).toHaveBeenCalled();

    projectSignal.set(getProject([{ category: 'doi', value: '456', id: '', type: 'identifier' }]));
    fixture.detectChanges();
    expect(dataciteService.logView).toHaveBeenLastCalledWith('123');
  });

  function getProject(identifiers?: Identifier[]) {
    return {
      identifiers: identifiers ?? [],
    };
  }
});
