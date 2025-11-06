import { MockComponents, MockProvider } from 'ng-mocks';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { CompareSectionComponent } from '@osf/shared/components/wiki/compare-section/compare-section.component';
import { ViewSectionComponent } from '@osf/shared/components/wiki/view-section/view-section.component';
import { WikiListComponent } from '@osf/shared/components/wiki/wiki-list/wiki-list.component';
import { WikiModes } from '@osf/shared/models/wiki/wiki.model';
import { WikiSelectors } from '@osf/shared/stores/wiki';

import { RegistryWikiComponent } from './registry-wiki.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe.skip('RegistryWikiComponent', () => {
  let component: RegistryWikiComponent;
  let fixture: ComponentFixture<RegistryWikiComponent>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockRouter: jest.Mocked<Router>;

  const mockResourceId = 'test-resource-id';
  const mockWikiId = 'test-wiki-id';

  beforeEach(async () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create()
      .withParams({ id: mockResourceId })
      .withQueryParams({ wiki: mockWikiId })
      .build();
    mockRouter = {
      navigate: jest.fn(),
      url: '/test-url',
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        RegistryWikiComponent,
        OSFTestingModule,
        ...MockComponents(
          SubHeaderComponent,
          WikiListComponent,
          ViewSectionComponent,
          CompareSectionComponent,
          ViewOnlyLinkMessageComponent
        ),
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        provideMockStore({
          signals: [
            { selector: WikiSelectors.getWikiModes, value: WikiModes.View },
            { selector: WikiSelectors.getPreviewContent, value: null },
            { selector: WikiSelectors.getWikiVersionContent, value: null },
            { selector: WikiSelectors.getCompareVersionContent, value: null },
            { selector: WikiSelectors.getWikiListLoading, value: false },
            { selector: WikiSelectors.getWikiList, value: [] },
            { selector: WikiSelectors.getCurrentWikiId, value: mockWikiId },
            { selector: WikiSelectors.getWikiVersions, value: [] },
            { selector: WikiSelectors.getWikiVersionsLoading, value: false },
            { selector: WikiSelectors.getComponentsWikiList, value: [] },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with resource ID from route', () => {
    expect(component.resourceId).toBe(mockResourceId);
  });

  it('should initialize with wiki ID from query params', () => {
    expect(component.wikiIdFromQueryParams).toBe(mockWikiId);
  });

  it('should compute hasViewOnly correctly', () => {
    expect(component.hasViewOnly()).toBe(false);
  });

  it('should toggle mode', () => {
    const toggleModeSpy = jest.spyOn(component.actions, 'toggleMode');
    component.toggleMode(WikiModes.Edit);
    expect(toggleModeSpy).toHaveBeenCalledWith(WikiModes.Edit);
  });

  it('should select version', () => {
    const versionId = 'version-1';
    const getWikiVersionContentSpy = jest.spyOn(component.actions, 'getWikiVersionContent');
    component.onSelectVersion(versionId);
    expect(getWikiVersionContentSpy).toHaveBeenCalledWith(component.currentWikiId(), versionId);
  });

  it('should not select version if empty', () => {
    const getWikiVersionContentSpy = jest.spyOn(component.actions, 'getWikiVersionContent');
    component.onSelectVersion('');
    expect(getWikiVersionContentSpy).not.toHaveBeenCalled();
  });

  it('should select compare version', () => {
    const versionId = 'version-1';
    const getCompareVersionContentSpy = jest.spyOn(component.actions, 'getCompareVersionContent');
    component.onSelectCompareVersion(versionId);
    expect(getCompareVersionContentSpy).toHaveBeenCalledWith(component.currentWikiId(), versionId);
  });

  it('should handle different route configurations', () => {
    const differentResourceId = 'different-resource-id';
    const differentWikiId = 'different-wiki-id';

    mockActivatedRoute = ActivatedRouteMockBuilder.create()
      .withParams({ id: differentResourceId })
      .withQueryParams({ wiki: differentWikiId })
      .build();

    fixture = TestBed.createComponent(RegistryWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.resourceId).toBe(differentResourceId);
    expect(component.wikiIdFromQueryParams).toBe(differentWikiId);
  });

  it('should handle missing query params', () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create()
      .withParams({ id: mockResourceId })
      .withQueryParams({})
      .build();

    fixture = TestBed.createComponent(RegistryWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.wikiIdFromQueryParams).toBeUndefined();
  });

  it('should handle missing route params', () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create()
      .withParams({})
      .withQueryParams({ wiki: mockWikiId })
      .build();

    fixture = TestBed.createComponent(RegistryWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.resourceId).toBeUndefined();
  });
});
