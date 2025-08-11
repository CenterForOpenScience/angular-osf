import { MockComponent, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ProjectOverviewComponent } from '@osf/features/project/overview/project-overview.component';

import { CollectionSubmissionOverviewComponent } from './collection-submission-overview.component';

describe.skip('CollectionSubmissionOverviewComponent', () => {
  let component: CollectionSubmissionOverviewComponent;
  let fixture: ComponentFixture<CollectionSubmissionOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionSubmissionOverviewComponent, MockComponent(ProjectOverviewComponent)],
      providers: [MockProvider(Router)],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionSubmissionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
