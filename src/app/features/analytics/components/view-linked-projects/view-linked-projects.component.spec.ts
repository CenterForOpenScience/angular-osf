import { MockComponents, MockProvider } from 'ng-mocks';

import { PaginatorState } from 'primeng/paginator';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { RegistryOverviewSelectors } from '@osf/features/registry/store/registry-overview';
import { ResourceType } from '@osf/shared/enums';
import { LinkedProjectsSelectors } from '@osf/shared/stores/linked-projects';
import {
  ContributorsListComponent,
  CustomPaginatorComponent,
  IconComponent,
  LoadingSpinnerComponent,
  SubHeaderComponent,
  TruncatedTextComponent,
} from '@shared/components';

import { ViewLinkedProjectsComponent } from './view-linked-projects.component';

import { MOCK_PROJECT_OVERVIEW } from '@testing/mocks';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('Component: View Duplicates', () => {
  let component: ViewLinkedProjectsComponent;
  let fixture: ComponentFixture<ViewLinkedProjectsComponent>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
    activatedRouteMock = ActivatedRouteMockBuilder.create()
      .withParams({ id: 'rid' })
      .withData({ resourceType: ResourceType.Project })
      .build();

    await TestBed.configureTestingModule({
      imports: [
        ViewLinkedProjectsComponent,
        OSFTestingModule,
        ...MockComponents(
          SubHeaderComponent,
          TruncatedTextComponent,
          LoadingSpinnerComponent,
          CustomPaginatorComponent,
          IconComponent,
          ContributorsListComponent
        ),
      ],
      providers: [
        provideMockStore({
          signals: [
            { selector: LinkedProjectsSelectors.getLinkedProjects, value: [] },
            { selector: LinkedProjectsSelectors.getLinkedProjectsLoading, value: false },
            { selector: LinkedProjectsSelectors.getLinkedProjectsTotalCount, value: 0 },
            { selector: ProjectOverviewSelectors.getProject, value: MOCK_PROJECT_OVERVIEW },
            { selector: RegistryOverviewSelectors.getRegistry, value: undefined },
          ],
        }),
        MockProvider(ActivatedRoute, activatedRouteMock),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewLinkedProjectsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update currentPage when page is defined', () => {
    const event: PaginatorState = { page: 1 } as PaginatorState;
    component.onPageChange(event);
    expect(component.currentPage()).toBe('2');
  });

  it('should not update currentPage when page is undefined', () => {
    component.currentPage.set('5');
    const event: PaginatorState = { page: undefined } as PaginatorState;
    component.onPageChange(event);
    expect(component.currentPage()).toBe('5');
  });
});
