import { provideStore, Store } from '@ngxs/store';

import { TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { MetaTagsService, ToastService } from '@osf/shared/services';
import { GetActivityLogs } from '@shared/stores/activity-logs';

import { ProjectOverviewComponent } from './project-overview.component';

describe('ProjectOverviewComponent', () => {
  let fixture: ComponentFixture<ProjectOverviewComponent>;
  let component: ProjectOverviewComponent;
  let store: Store;

  beforeEach(async () => {
    TestBed.overrideComponent(ProjectOverviewComponent, { set: { template: '' } });

    await TestBed.configureTestingModule({
      imports: [ProjectOverviewComponent],
      providers: [
        provideStore([]),

        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 'proj123' } }, parent: null } },

        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),

        { provide: DialogService, useValue: { open: () => ({ onClose: of(null) }) } },
        { provide: TranslateService, useValue: { instant: (k: string) => k } },
        { provide: ToastService, useValue: { showSuccess: jest.fn() } },
        { provide: MetaTagsService, useValue: { updateMetaTags: jest.fn() } },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(ProjectOverviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dispatches GetActivityLogs with numeric page and pageSize on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    jest.spyOn(component as any, 'setupDataciteViewTrackerEffect').mockReturnValue(of(null));

    component.ngOnInit();

    const actions = dispatchSpy.mock.calls.map((c) => c[0]);
    const activityAction = actions.find((a) => a instanceof GetActivityLogs) as GetActivityLogs;

    expect(activityAction).toBeDefined();
    expect(activityAction.projectId).toBe('proj123');
    expect(activityAction.page).toBe(1);
    expect(activityAction.pageSize).toBe(5);
    expect(typeof activityAction.page).toBe('number');
    expect(typeof activityAction.pageSize).toBe('number');
  });
});
