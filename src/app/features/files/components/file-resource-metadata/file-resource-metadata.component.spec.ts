import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { ResourceMetadata } from '@osf/shared/models/resource-metadata.model';

import { MOCK_CONTRIBUTOR, MOCK_CONTRIBUTOR_WITHOUT_HISTORY } from '@testing/mocks/contributors.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';

import { FilesSelectors } from '../../store';

import { FileResourceMetadataComponent } from './file-resource-metadata.component';

describe('FileResourceMetadataComponent', () => {
  let component: FileResourceMetadataComponent;
  let fixture: ComponentFixture<FileResourceMetadataComponent>;

  const mockResourceMetadata: ResourceMetadata = {
    title: 'Test Resource',
    description: 'Test Description',
    dateCreated: new Date('2023-01-01'),
    dateModified: new Date('2023-01-02'),
    language: 'en',
    resourceTypeGeneral: 'Dataset',
    identifiers: [],
    funders: [],
  };

  const mockContributors = [MOCK_CONTRIBUTOR, MOCK_CONTRIBUTOR_WITHOUT_HISTORY];

  const defaultSignals = [
    { selector: FilesSelectors.getResourceMetadata, value: mockResourceMetadata },
    { selector: FilesSelectors.getContributors, value: mockContributors },
    { selector: FilesSelectors.isResourceMetadataLoading, value: false },
    { selector: FilesSelectors.isResourceContributorsLoading, value: false },
    { selector: FilesSelectors.isFilesAnonymous, value: false },
  ];

  function setup(overrides: BaseSetupOverrides = {}): void {
    TestBed.configureTestingModule({
      imports: [FileResourceMetadataComponent, MockComponent(ContributorsListComponent)],
      providers: [
        provideOSFCore(),
        provideMockStore({ signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides) }),
      ],
    });

    fixture = TestBed.createComponent(FileResourceMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should have default resource type', () => {
    setup();

    expect(component.resourceType()).toBe('nodes');
  });

  it('should get resource metadata from store', () => {
    setup();

    expect(component.resourceMetadata()).toEqual(mockResourceMetadata);
  });

  it('should get contributors from store', () => {
    setup();

    expect(component.contributors()).toEqual(mockContributors);
  });

  it('should expose loading states from store selectors', () => {
    setup({
      selectorOverrides: [
        { selector: FilesSelectors.isResourceMetadataLoading, value: true },
        { selector: FilesSelectors.isResourceContributorsLoading, value: true },
      ],
    });

    expect(component.isResourceMetadataLoading()).toBe(true);
    expect(component.isResourceContributorsLoading()).toBe(true);
  });

  it('should expose isAnonymous from store', () => {
    setup({
      selectorOverrides: [{ selector: FilesSelectors.isFilesAnonymous, value: true }],
    });

    expect(component.isAnonymous()).toBe(true);
  });

  it('should handle input changes', () => {
    setup();

    fixture.componentRef.setInput('resourceType', 'preprints');
    fixture.detectChanges();

    expect(component.resourceType()).toBe('preprints');
  });

  it('should support missing metadata and empty contributors', () => {
    setup({
      selectorOverrides: [
        { selector: FilesSelectors.getResourceMetadata, value: null },
        { selector: FilesSelectors.getContributors, value: [] },
      ],
    });

    expect(component.resourceMetadata()).toBeNull();
    expect(component.contributors()).toEqual([]);
  });
});
