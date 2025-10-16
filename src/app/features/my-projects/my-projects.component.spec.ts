import { MockComponents, MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { MyProjectsTab } from '@osf/features/my-projects/enums';
import { SortOrder } from '@osf/shared/enums';
import { IS_MEDIUM } from '@osf/shared/helpers';
import { BookmarksSelectors, MyResourcesSelectors } from '@osf/shared/stores';
import {
  MyProjectsTableComponent,
  SearchInputComponent,
  SelectComponent,
  SubHeaderComponent,
} from '@shared/components';
import { CustomDialogService, ProjectRedirectDialogService } from '@shared/services';

import { MyProjectsComponent } from './my-projects.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('MyProjectsComponent', () => {
  let component: MyProjectsComponent;
  let fixture: ComponentFixture<MyProjectsComponent>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;
  let isMediumSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isMediumSubject = new BehaviorSubject<boolean>(false);
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withQueryParams({ tab: '1' }).build();
    mockRouter = RouterMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [
        MyProjectsComponent,
        OSFTestingModule,
        ...MockComponents(SubHeaderComponent, MyProjectsTableComponent, SelectComponent, SearchInputComponent),
      ],
      providers: [
        provideMockStore({
          signals: [
            { selector: MyResourcesSelectors.getTotalProjects, value: 0 },
            { selector: MyResourcesSelectors.getTotalRegistrations, value: 0 },
            { selector: MyResourcesSelectors.getTotalPreprints, value: 0 },
            { selector: MyResourcesSelectors.getTotalBookmarks, value: 0 },
            { selector: BookmarksSelectors.getBookmarksCollectionId, value: null },
            { selector: MyResourcesSelectors.getProjects, value: [] },
            { selector: MyResourcesSelectors.getRegistrations, value: [] },
            { selector: MyResourcesSelectors.getPreprints, value: [] },
            { selector: MyResourcesSelectors.getBookmarks, value: [] },
          ],
        }),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        MockProvider(CustomDialogService),
        MockProvider(IS_MEDIUM, isMediumSubject),
        MockProvider(ProjectRedirectDialogService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch data for projects tab', () => {
    expect(component.selectedTab()).toBe(MyProjectsTab.Projects);
    expect(component.isLoading()).toBe(false);
  });

  it('should paginate and update query params', () => {
    component.onPageChange({ first: 30, rows: 15 } as any);

    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: mockActivatedRoute,
      queryParams: { page: '3', size: '15', tab: '1' },
    });
  });

  it('should sort and update query params', () => {
    component.onSort({ field: 'updated', order: SortOrder.Desc } as any);

    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: mockActivatedRoute,
      queryParams: { sortColumn: 'updated', sortOrder: 'desc', tab: '1' },
    });
  });

  it('should clear and reset on tab change', () => {
    component.onTabChange(MyProjectsTab.Registrations);

    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: mockActivatedRoute,
      queryParams: { page: '1', tab: '2' },
    });
  });

  it('should navigate to project', () => {
    const project = { id: 'p1' } as any;
    component.navigateToProject(project);

    expect(component.activeProject()).toEqual(project);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['p1']);
  });
});
