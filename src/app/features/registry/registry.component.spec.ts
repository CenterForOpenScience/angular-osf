import { Store } from '@ngxs/store';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { HelpScoutService } from '@core/services/help-scout.service';
import { PrerenderReadyService } from '@core/services/prerender-ready.service';
import { ClearCurrentProvider } from '@core/store/provider';
import { AnalyticsService } from '@osf/shared/services/analytics.service';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { MetaTagsService } from '@osf/shared/services/meta-tags.service';
import { ContributorsSelectors } from '@osf/shared/stores/contributors';

import { RegistrySelectors } from './store/registry';
import { RegistryComponent } from './registry.component';

import { DataciteMockFactory } from '@testing/mocks/datacite.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { AnalyticsServiceMockFactory } from '@testing/providers/analytics.service.mock';
import { HelpScoutServiceMockFactory } from '@testing/providers/help-scout.service.mock';
import { MetaTagsServiceMockFactory } from '@testing/providers/meta-tags.service.mock';
import { PrerenderReadyServiceMockFactory } from '@testing/providers/prerender-ready.service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistryComponent', () => {
  let component: RegistryComponent;
  let fixture: ComponentFixture<RegistryComponent>;
  let helpScoutService: ReturnType<typeof HelpScoutServiceMockFactory>;
  let metaTagsService: ReturnType<typeof MetaTagsServiceMockFactory>;
  let dataciteService: ReturnType<typeof DataciteMockFactory>;
  let prerenderReadyService: ReturnType<typeof PrerenderReadyServiceMockFactory>;
  let analyticsService: ReturnType<typeof AnalyticsServiceMockFactory>;
  let store: Store;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ id: 'registry-1' }).build();

    helpScoutService = HelpScoutServiceMockFactory();
    metaTagsService = MetaTagsServiceMockFactory();
    dataciteService = DataciteMockFactory();
    prerenderReadyService = PrerenderReadyServiceMockFactory();
    analyticsService = AnalyticsServiceMockFactory();

    await TestBed.configureTestingModule({
      imports: [RegistryComponent, OSFTestingModule],
      providers: [
        { provide: HelpScoutService, useValue: helpScoutService },
        { provide: MetaTagsService, useValue: metaTagsService },
        { provide: DataciteService, useValue: dataciteService },
        { provide: PrerenderReadyService, useValue: prerenderReadyService },
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideMockStore({
          signals: [
            { selector: RegistrySelectors.getRegistry, value: null },
            { selector: RegistrySelectors.isRegistryLoading, value: false },
            { selector: RegistrySelectors.getIdentifiers, value: [] },
            { selector: RegistrySelectors.getLicense, value: null },
            { selector: RegistrySelectors.isLicenseLoading, value: false },
            { selector: ContributorsSelectors.getBibliographicContributors, value: [] },
            { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(RegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call the helpScoutService', () => {
    expect(helpScoutService.setResourceType).toHaveBeenCalledWith('registration');
  });

  it('should call unsetResourceType and clearCurrentProvider on destroy', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnDestroy();
    expect(helpScoutService.unsetResourceType).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(new ClearCurrentProvider());
  });

  it('should call prerenderReady.setNotReady in constructor', () => {
    expect(prerenderReadyService.setNotReady).toHaveBeenCalled();
  });

  it('should call dataciteService.logIdentifiableView', () => {
    expect(dataciteService.logIdentifiableView).toHaveBeenCalled();
  });
});
