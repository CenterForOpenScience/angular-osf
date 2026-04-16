import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { MOCK_PROJECT_COLLECTION_SUBMISSIONS } from '@testing/data/collections/collection-submissions.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';

import { MetadataCollectionsComponent } from './metadata-collections.component';

describe('MetadataCollectionsComponent', () => {
  let component: MetadataCollectionsComponent;
  let fixture: ComponentFixture<MetadataCollectionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MetadataCollectionsComponent],
      providers: [provideOSFCore(), MockProvider(ActivatedRoute, ActivatedRouteMockBuilder.create().build())],
    });

    fixture = TestBed.createComponent(MetadataCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show skeleton while loading submissions', () => {
    fixture.componentRef.setInput('isProjectSubmissionsLoading', true);
    fixture.detectChanges();

    const skeleton = fixture.debugElement.query(By.css('p-skeleton'));
    expect(skeleton).toBeTruthy();
  });

  it('should render collection items when submissions exist', () => {
    fixture.componentRef.setInput('isProjectSubmissionsLoading', false);
    fixture.componentRef.setInput('projectSubmissions', MOCK_PROJECT_COLLECTION_SUBMISSIONS);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('osf-metadata-collection-item'));
    expect(items.length).toBe(MOCK_PROJECT_COLLECTION_SUBMISSIONS.length);
  });

  it('should show empty state message when there are no submissions', () => {
    fixture.componentRef.setInput('projectSubmissions', []);
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent;
    expect(content).toContain('project.overview.metadata.noCollections');
  });
});
