import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { HelpScoutService } from '@core/services/help-scout.service';
import { PrerenderReadyService } from '@core/services/prerender-ready.service';
import { ProjectOverviewModel } from '@osf/features/project/overview/models';
import { IdentifierModel } from '@osf/shared/models/identifiers/identifier.model';
import { MetaTagsData } from '@osf/shared/models/meta-tags/meta-tags-data.model';
import { AnalyticsService } from '@osf/shared/services/analytics.service';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { MetaTagsService } from '@osf/shared/services/meta-tags.service';
import { MetaTagsBuilderService } from '@osf/shared/services/meta-tags-builder.service';
import { ContributorsSelectors } from '@osf/shared/stores/contributors';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';

import { MOCK_PROJECT_OVERVIEW } from '@testing/mocks/project-overview.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { AnalyticsServiceMockFactory } from '@testing/providers/analytics.service.mock';
import { DataciteServiceMock } from '@testing/providers/datacite.service.mock';
import { HelpScoutServiceMockFactory } from '@testing/providers/help-scout.service.mock';
import { MetaTagsServiceMockFactory } from '@testing/providers/meta-tags.service.mock';
import { MetaTagsBuilderServiceMockFactory } from '@testing/providers/meta-tags-builder.service.mock';
import { PrerenderReadyServiceMockFactory } from '@testing/providers/prerender-ready.service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';

import { GetProjectById, GetProjectIdentifiers, GetProjectLicense, ProjectOverviewSelectors } from './overview/store';
import { ProjectComponent } from './project.component';

interface SetupOverrides extends BaseSetupOverrides {
  projectId?: string;
  selectorOverrides?: SignalOverride[];
  childCanonicalPath?: string;
  childCanonicalPathTemplate?: string;
  childParams?: Record<string, string>;
}

function setup(overrides: SetupOverrides = {}) {
  const projectId = overrides.projectId ?? 'project-1';
  const helpScoutService = HelpScoutServiceMockFactory();
  const analyticsService = AnalyticsServiceMockFactory();
  const metaTagsService = MetaTagsServiceMockFactory();
  const metaTagsBuilderService = MetaTagsBuilderServiceMockFactory();
  const dataciteService = DataciteServiceMock.simple();
  const prerenderReadyService = PrerenderReadyServiceMockFactory();
  const routerBuilder = RouterMockBuilder.create();
  const routerMock = routerBuilder.build();

  const routeBuilder = ActivatedRouteMockBuilder.create().withParams(overrides.routeParams ?? { id: projectId });

  if (overrides.hasParent === false) {
    routeBuilder.withNoParent();
  }

  if (overrides.childCanonicalPath || overrides.childCanonicalPathTemplate || overrides.childParams) {
    routeBuilder.withFirstChild((builder) => {
      if (overrides.childCanonicalPath) {
        builder.withData({ canonicalPath: overrides.childCanonicalPath });
      }
      if (overrides.childCanonicalPathTemplate) {
        builder.withData({ canonicalPathTemplate: overrides.childCanonicalPathTemplate });
      }
      if (overrides.childParams) {
        builder.withParams(overrides.childParams);
      }
    });
  }

  const mockActivatedRoute = routeBuilder.build();

  metaTagsBuilderService.buildProjectMetaTagsData.mockImplementation(
    ({ project, canonicalPath }): MetaTagsData =>
      ({
        osfGuid: project.id,
        canonicalUrl: `http://localhost:4200/${project.id}/${canonicalPath}`,
      }) as MetaTagsData
  );

  const defaultSignals: SignalOverride[] = [
    { selector: ProjectOverviewSelectors.getProject, value: null },
    { selector: ProjectOverviewSelectors.getProjectLoading, value: false },
    { selector: ProjectOverviewSelectors.getIdentifiers, value: [] },
    { selector: ProjectOverviewSelectors.getLicense, value: { name: 'MIT' } },
    { selector: ProjectOverviewSelectors.isLicenseLoading, value: false },
    { selector: ContributorsSelectors.getBibliographicContributors, value: [] },
    { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: false },
    { selector: CurrentResourceSelectors.getCurrentResource, value: null },
    { selector: CurrentResourceSelectors.hasNoPermissions, value: false },
  ];

  const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

  TestBed.configureTestingModule({
    imports: [ProjectComponent],
    providers: [
      provideOSFCore(),
      MockProvider(HelpScoutService, helpScoutService),
      MockProvider(AnalyticsService, analyticsService),
      MockProvider(MetaTagsService, metaTagsService),
      MockProvider(MetaTagsBuilderService, metaTagsBuilderService),
      MockProvider(DataciteService, dataciteService),
      MockProvider(PrerenderReadyService, prerenderReadyService),
      MockProvider(ActivatedRoute, mockActivatedRoute),
      MockProvider(Router, routerMock),
      provideMockStore({ signals }),
    ],
  });

  const store = TestBed.inject(Store);
  const fixture = TestBed.createComponent(ProjectComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return {
    component,
    fixture,
    store,
    routerBuilder,
    routerMock,
    helpScoutService,
    analyticsService,
    metaTagsService,
    metaTagsBuilderService,
    dataciteService,
    prerenderReadyService,
  };
}

describe('Component: Project', () => {
  it('should set helpScout resource type and prerender not ready on init', () => {
    const { helpScoutService, prerenderReadyService } = setup();

    expect(helpScoutService.setResourceType).toHaveBeenCalledWith('project');
    expect(prerenderReadyService.setNotReady).toHaveBeenCalled();
  });

  it('should dispatch init actions when project id is available', () => {
    const { store } = setup();

    expect(store.dispatch).toHaveBeenCalledWith(new GetProjectById('project-1'));
    expect(store.dispatch).toHaveBeenCalledWith(new GetProjectIdentifiers('project-1'));
  });

  it('should dispatch get license when project has licenseId', () => {
    const project = { ...MOCK_PROJECT_OVERVIEW, licenseId: 'license-1' } as ProjectOverviewModel;
    const { store } = setup({
      selectorOverrides: [{ selector: ProjectOverviewSelectors.getProject, value: project }],
    });

    expect(store.dispatch).toHaveBeenCalledWith(new GetProjectLicense('license-1'));
  });

  it('should call datacite tracking on init', () => {
    const { dataciteService } = setup();

    expect(dataciteService.logIdentifiableView).toHaveBeenCalled();
  });

  it('should map identifiers to null when identifiers are empty', () => {
    const { dataciteService } = setup();
    const identifiers$ = (dataciteService.logIdentifiableView as Mock).mock.calls[0][0];
    let emitted: unknown;

    identifiers$.subscribe((value: unknown) => {
      emitted = value;
    });

    expect(emitted).toBeNull();
  });

  it('should map identifiers to payload when identifiers exist', () => {
    const identifiers = [
      {
        id: 'identifier-1',
        type: 'identifiers',
        category: 'doi',
        value: '10.1234/osf.test',
      },
    ] as IdentifierModel[];
    const { dataciteService } = setup({
      selectorOverrides: [{ selector: ProjectOverviewSelectors.getIdentifiers, value: identifiers }],
    });
    const identifiers$ = (dataciteService.logIdentifiableView as Mock).mock.calls[0][0];
    let emitted: unknown;

    identifiers$.subscribe((value: unknown) => {
      emitted = value;
    });

    expect(emitted).toEqual({ identifiers });
  });

  it('should build and update meta tags with canonical path from active subroute', () => {
    const { metaTagsBuilderService, metaTagsService } = setup({
      selectorOverrides: [{ selector: ProjectOverviewSelectors.getProject, value: MOCK_PROJECT_OVERVIEW }],
      childCanonicalPath: 'files/osfstorage',
    });

    expect(metaTagsBuilderService.buildProjectMetaTagsData).toHaveBeenCalledWith(
      expect.objectContaining({
        project: expect.objectContaining({ id: 'project-1' }),
        canonicalPath: 'files/osfstorage',
      })
    );
    expect(metaTagsService.updateMetaTags).toHaveBeenCalledWith(
      expect.objectContaining({
        canonicalUrl: 'http://localhost:4200/project-1/files/osfstorage',
      }),
      expect.anything()
    );
    expect(metaTagsService.updateMetaTags).toHaveBeenCalledTimes(1);
  });

  it('should not build or update meta tags when current project is null', () => {
    const { metaTagsBuilderService, metaTagsService } = setup();

    expect(metaTagsBuilderService.buildProjectMetaTagsData).not.toHaveBeenCalled();
    expect(metaTagsService.updateMetaTags).not.toHaveBeenCalled();
  });

  it('should send analytics on NavigationEnd', () => {
    const mockResource = { id: 'project-1' };
    const { routerBuilder, analyticsService } = setup({
      selectorOverrides: [
        { selector: CurrentResourceSelectors.getCurrentResource, value: mockResource },
        { selector: CurrentResourceSelectors.hasNoPermissions, value: true },
      ],
    });
    routerBuilder.emit(new NavigationEnd(1, '/project-1', '/project-1/overview'));
    expect(analyticsService.sendCountedUsageForRegistrationAndProjects).toHaveBeenCalledWith(
      '/project-1/overview',
      mockResource
    );
  });

  it('should call unsetResourceType on destroy', () => {
    const { component, helpScoutService } = setup();

    component.ngOnDestroy();

    expect(helpScoutService.unsetResourceType).toHaveBeenCalled();
  });
});
