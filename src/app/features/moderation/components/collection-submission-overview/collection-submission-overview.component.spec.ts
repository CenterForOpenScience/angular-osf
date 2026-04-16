import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectOverviewComponent } from '@osf/features/project/overview/project-overview.component';
import { Mode } from '@osf/shared/enums/mode.enum';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';

import { CollectionSubmissionOverviewComponent } from './collection-submission-overview.component';

describe('CollectionSubmissionOverviewComponent', () => {
  let component: CollectionSubmissionOverviewComponent;
  let fixture: ComponentFixture<CollectionSubmissionOverviewComponent>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(() => {
    mockRouter = RouterMockBuilder.create().build();
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withQueryParams({ mode: Mode.Moderation }).build();

    TestBed.configureTestingModule({
      imports: [CollectionSubmissionOverviewComponent, ...MockComponents(ProjectOverviewComponent)],
      providers: [provideOSFCore(), MockProvider(Router, mockRouter), MockProvider(ActivatedRoute, mockActivatedRoute)],
    });

    fixture = TestBed.createComponent(CollectionSubmissionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute isModerationMode correctly when mode is moderation', () => {
    expect(component.isModerationMode()).toBe(true);
  });

  it('should compute isModerationMode correctly when mode is not moderation', () => {
    mockActivatedRoute.snapshot!.queryParams = { mode: 'other' };
    fixture = TestBed.createComponent(CollectionSubmissionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isModerationMode()).toBe(false);
  });

  it('should navigate away when not in moderation mode', () => {
    mockActivatedRoute.snapshot!.queryParams = { mode: 'other' };
    fixture = TestBed.createComponent(CollectionSubmissionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['../'],
      expect.objectContaining({ relativeTo: expect.any(ActivatedRoute) })
    );
  });

  it('should not navigate when in moderation mode', () => {
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
