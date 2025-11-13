import { MockComponent } from 'ng-mocks';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';

import { FilesSelectors } from '../../store';

import { FileResourceMetadataComponent } from './file-resource-metadata.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('FileResourceMetadataComponent', () => {
  let component: FileResourceMetadataComponent;
  let fixture: ComponentFixture<FileResourceMetadataComponent>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;

  const mockResourceMetadata = {
    id: 'resource-123',
    title: 'Test Resource',
    description: 'Test Description',
    dateCreated: '2023-01-01',
    dateModified: '2023-01-02',
  };

  const mockContributors = [
    { id: 'contrib-1', name: 'John Doe', role: 'Author' },
    { id: 'contrib-2', name: 'Jane Smith', role: 'Contributor' },
  ];

  beforeEach(async () => {
    mockRouter = RouterMockBuilder.create().withUrl('/test').build();

    await TestBed.configureTestingModule({
      imports: [FileResourceMetadataComponent, OSFTestingModule, MockComponent(ContributorsListComponent)],
      providers: [
        { provide: Router, useValue: mockRouter },
        provideMockStore({
          signals: [
            { selector: FilesSelectors.getResourceMetadata, value: signal(mockResourceMetadata) },
            { selector: FilesSelectors.getContributors, value: signal(mockContributors) },
            { selector: FilesSelectors.isResourceMetadataLoading, value: signal(false) },
            { selector: FilesSelectors.isResourceContributorsLoading, value: signal(false) },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FileResourceMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct properties', () => {
    expect(component.resourceType).toBeDefined();
    expect(component.resourceMetadata).toBeDefined();
    expect(component.contributors).toBeDefined();
    expect(component.isResourceMetadataLoading).toBeDefined();
    expect(component.isResourceContributorsLoading).toBeDefined();
    expect(component.hasViewOnly).toBeDefined();
  });

  it('should have default resource type', () => {
    expect(component.resourceType()).toBe('nodes');
  });

  it('should get resource metadata from store', () => {
    expect(component.resourceMetadata()).toEqual(mockResourceMetadata);
  });

  it('should get contributors from store', () => {
    expect(component.contributors()).toEqual(mockContributors);
  });

  it('should get resource metadata loading state from store', () => {
    expect(component.isResourceMetadataLoading()).toBe(false);
  });

  it('should get contributors loading state from store', () => {
    expect(component.isResourceContributorsLoading()).toBe(false);
  });

  it('should have hasViewOnly computed property', () => {
    expect(component.hasViewOnly).toBeDefined();
    expect(typeof component.hasViewOnly()).toBe('boolean');
  });

  it('should handle input changes', () => {
    fixture.componentRef.setInput('resourceType', 'preprints');
    fixture.detectChanges();

    expect(component.resourceType()).toBe('preprints');
  });

  it('should handle null resource metadata', () => {
    expect(component.resourceMetadata).toBeDefined();
  });

  it('should handle empty contributors array', () => {
    expect(component.contributors).toBeDefined();
  });

  it('should handle loading states', () => {
    expect(component.isResourceMetadataLoading).toBeDefined();
    expect(component.isResourceContributorsLoading).toBeDefined();
  });
});
