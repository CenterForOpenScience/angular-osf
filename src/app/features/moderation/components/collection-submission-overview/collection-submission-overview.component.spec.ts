import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectOverviewComponent } from '@osf/features/project/overview/project-overview.component';
import { Mode } from '@shared/enums';

import { CollectionSubmissionOverviewComponent } from './collection-submission-overview.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';

describe('CollectionSubmissionOverviewComponent', () => {
  let component: CollectionSubmissionOverviewComponent;
  let fixture: ComponentFixture<CollectionSubmissionOverviewComponent>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
    mockRouter = RouterMockBuilder.create().build();
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withQueryParams({ mode: Mode.Moderation }).build();

    await TestBed.configureTestingModule({
      imports: [CollectionSubmissionOverviewComponent, OSFTestingModule, ...MockComponents(ProjectOverviewComponent)],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

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

    expect(mockRouter.navigate).toHaveBeenCalledWith(['../'], { relativeTo: mockActivatedRoute });
  });

  it('should not navigate when in moderation mode', () => {
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
