import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { HelpScoutService } from '@core/services/help-scout.service';
import { PrerenderReadyService } from '@core/services/prerender-ready.service';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { MetaTagsService } from '@osf/shared/services/meta-tags.service';
import { ContributorsSelectors } from '@osf/shared/stores/contributors';

import { ProjectOverviewSelectors } from './overview/store';
import { ProjectComponent } from './project.component';

import { DataciteMockFactory } from '@testing/mocks/datacite.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { HelpScoutServiceMockFactory } from '@testing/providers/help-scout.service.mock';
import { MetaTagsServiceMockFactory } from '@testing/providers/meta-tags.service.mock';
import { PrerenderReadyServiceMockFactory } from '@testing/providers/prerender-ready.service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('Component: Project', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;
  let helpScoutService: ReturnType<typeof HelpScoutServiceMockFactory>;
  let metaTagsService: ReturnType<typeof MetaTagsServiceMockFactory>;
  let dataciteService: ReturnType<typeof DataciteMockFactory>;
  let prerenderReadyService: ReturnType<typeof PrerenderReadyServiceMockFactory>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'project-1' }).build();

    helpScoutService = HelpScoutServiceMockFactory();
    metaTagsService = MetaTagsServiceMockFactory();
    dataciteService = DataciteMockFactory();
    prerenderReadyService = PrerenderReadyServiceMockFactory();

    await TestBed.configureTestingModule({
      imports: [ProjectComponent, OSFTestingModule],
      providers: [
        { provide: HelpScoutService, useValue: helpScoutService },
        { provide: MetaTagsService, useValue: metaTagsService },
        { provide: DataciteService, useValue: dataciteService },
        { provide: PrerenderReadyService, useValue: prerenderReadyService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideMockStore({
          signals: [
            { selector: ProjectOverviewSelectors.getProject, value: null },
            { selector: ProjectOverviewSelectors.getProjectLoading, value: false },
            { selector: ProjectOverviewSelectors.getIdentifiers, value: [] },
            { selector: ProjectOverviewSelectors.getLicense, value: null },
            { selector: ProjectOverviewSelectors.isLicenseLoading, value: false },
            { selector: ContributorsSelectors.getBibliographicContributors, value: [] },
            { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call the helpScoutService', () => {
    expect(helpScoutService.setResourceType).toHaveBeenCalledWith('project');
  });

  it('should call unsetResourceType on destroy', () => {
    component.ngOnDestroy();
    expect(helpScoutService.unsetResourceType).toHaveBeenCalled();
  });

  it('should call prerenderReady.setNotReady in constructor', () => {
    expect(prerenderReadyService.setNotReady).toHaveBeenCalled();
  });

  it('should call dataciteService.logIdentifiableView', () => {
    expect(dataciteService.logIdentifiableView).toHaveBeenCalled();
  });
});
