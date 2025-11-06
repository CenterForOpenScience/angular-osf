import { provideStore, Store } from '@ngxs/store';

import { TranslateService } from '@ngx-translate/core';
import { MockComponents } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { ResourceMetadataComponent } from '@osf/shared/components/resource-metadata/resource-metadata.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { MetaTagsService } from '@osf/shared/services/meta-tags.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { DataciteService } from '@shared/services/datacite/datacite.service';
import { GetActivityLogs } from '@shared/stores/activity-logs';

import { OverviewParentProjectComponent } from './components/overview-parent-project/overview-parent-project.component';
import { ProjectOverviewToolbarComponent } from './components/project-overview-toolbar/project-overview-toolbar.component';
import {
  CitationAddonCardComponent,
  FilesWidgetComponent,
  LinkedResourcesComponent,
  OverviewComponentsComponent,
  OverviewWikiComponent,
  RecentActivityComponent,
} from './components';
import { ProjectOverviewComponent } from './project-overview.component';

import { DataciteMockFactory } from '@testing/mocks/datacite.service.mock';

describe('ProjectOverviewComponent', () => {
  let fixture: ComponentFixture<ProjectOverviewComponent>;
  let component: ProjectOverviewComponent;
  let store: Store;
  let dataciteService: jest.Mocked<DataciteService>;

  beforeEach(async () => {
    TestBed.overrideComponent(ProjectOverviewComponent, { set: { template: '' } });
    dataciteService = DataciteMockFactory();
    await TestBed.configureTestingModule({
      imports: [
        ProjectOverviewComponent,
        ...MockComponents(
          SubHeaderComponent,
          LoadingSpinnerComponent,
          OverviewWikiComponent,
          OverviewComponentsComponent,
          LinkedResourcesComponent,
          RecentActivityComponent,
          ProjectOverviewToolbarComponent,
          ResourceMetadataComponent,
          FilesWidgetComponent,
          ViewOnlyLinkMessageComponent,
          OverviewParentProjectComponent,
          CitationAddonCardComponent
        ),
      ],
      providers: [
        provideStore([]),
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 'proj123' } }, parent: null } },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: DataciteService, useValue: dataciteService },
        { provide: DialogService, useValue: { open: () => ({ onClose: of(null) }) } },
        { provide: TranslateService, useValue: { instant: (k: string) => k } },
        { provide: ToastService, useValue: { showSuccess: jest.fn() } },
        { provide: MetaTagsService, useValue: { updateMetaTags: jest.fn() } },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ProjectOverviewComponent);
    component = fixture.componentInstance;
  });

  it('should log to datacite', () => {
    expect(dataciteService.logIdentifiableView).toHaveBeenCalledWith(component.currentProject$);
  });

  it('dispatches GetActivityLogs with numeric page and pageSize on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    jest.spyOn(component as any, 'setupDataciteViewTrackerEffect').mockReturnValue(of(null));

    component.ngOnInit();

    const actions = dispatchSpy.mock.calls.map((c) => c[0]);
    const activityAction = actions.find((a) => a instanceof GetActivityLogs) as GetActivityLogs;

    expect(activityAction).toBeDefined();
    expect(activityAction.projectId).toBe('proj123');
    expect(activityAction.page).toBe(1);
    expect(activityAction.pageSize).toBe(5);
    expect(typeof activityAction.page).toBe('number');
    expect(typeof activityAction.pageSize).toBe('number');
  });
});
