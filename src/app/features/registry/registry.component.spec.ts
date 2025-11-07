import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RegistrySelectors } from '@osf/features/registry/store/registry';
import { AnalyticsService } from '@osf/shared/services/analytics.service';
import { MetaTagsService } from '@osf/shared/services/meta-tags.service';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { RegistryComponent } from './registry.component';

import { DataciteMockFactory } from '@testing/mocks/datacite.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistryComponent', () => {
  let fixture: ComponentFixture<RegistryComponent>;
  let component: RegistryComponent;
  let dataciteService: jest.Mocked<DataciteService>;
  let metaTagsService: jest.Mocked<MetaTagsService>;
  let analyticsService: jest.Mocked<AnalyticsService>;

  const mockRegistry = {
    id: 'test-registry-id',
    title: 'Test Registry',
    description: 'Test Description',
    dateRegistered: '2023-01-01',
    dateModified: '2023-01-02',
    doi: '10.1234/test',
    tags: ['tag1', 'tag2'],
    license: { name: 'Test License' },
    contributors: [{ fullName: 'John Doe', givenName: 'John', familyName: 'Doe' }],
    isPublic: true,
  };

  beforeEach(async () => {
    dataciteService = DataciteMockFactory();
    metaTagsService = {
      updateMetaTags: jest.fn(),
    } as any;
    analyticsService = {
      sendCountedUsage: jest.fn().mockReturnValue(of({})),
    } as any;

    await TestBed.configureTestingModule({
      imports: [RegistryComponent, OSFTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: ActivatedRouteMockBuilder.create().withParams({ id: 'test-registry-id' }).build(),
        },
        { provide: DataciteService, useValue: dataciteService },
        { provide: MetaTagsService, useValue: metaTagsService },
        { provide: AnalyticsService, useValue: analyticsService },
        provideMockStore({
          signals: [
            { selector: RegistrySelectors.getRegistry, value: mockRegistry },
            { selector: RegistrySelectors.isRegistryLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be an instance of RegistryComponent', () => {
    expect(component).toBeInstanceOf(RegistryComponent);
  });

  it('should have NGXS selectors defined', () => {
    expect(component.registry).toBeDefined();
    expect(component.isRegistryLoading).toBeDefined();
  });

  it('should have services injected', () => {
    expect(component.analyticsService).toBeDefined();
  });

  it('should handle ngOnDestroy', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('should call datacite service on initialization', () => {
    expect(dataciteService.logIdentifiableView).toHaveBeenCalledWith(component.identifiersForDatacite$);
  });

  it('should handle registry loading effects', () => {
    expect(component).toBeTruthy();
  });
});
