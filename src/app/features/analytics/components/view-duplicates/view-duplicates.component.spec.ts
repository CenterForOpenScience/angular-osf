import { MockComponents, MockProvider } from 'ng-mocks';

import { PaginatorState } from 'primeng/paginator';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { RegistryOverviewSelectors } from '@osf/features/registry/store/registry-overview';
import { ContributorsListComponent } from '@osf/shared/components/contributors-list/contributors-list.component';
import { CustomPaginatorComponent } from '@osf/shared/components/custom-paginator/custom-paginator.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { TruncatedTextComponent } from '@osf/shared/components/truncated-text/truncated-text.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { DuplicatesSelectors } from '@osf/shared/stores/duplicates';

import { ViewDuplicatesComponent } from './view-duplicates.component';

import { MOCK_PROJECT_OVERVIEW } from '@testing/mocks/project-overview.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('Component: View Duplicates', () => {
  let component: ViewDuplicatesComponent;
  let fixture: ComponentFixture<ViewDuplicatesComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;
  let mockCustomDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;

  beforeEach(async () => {
    mockCustomDialogService = CustomDialogServiceMockBuilder.create().build();
    routerMock = RouterMockBuilder.create().build();
    activatedRouteMock = ActivatedRouteMockBuilder.create()
      .withParams({ id: 'rid' })
      .withData({ resourceType: ResourceType.Project })
      .build();

    await TestBed.configureTestingModule({
      imports: [
        ViewDuplicatesComponent,
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
            { selector: DuplicatesSelectors.getDuplicates, value: [] },
            { selector: DuplicatesSelectors.getDuplicatesLoading, value: false },
            { selector: DuplicatesSelectors.getDuplicatesTotalCount, value: 0 },
            { selector: ProjectOverviewSelectors.getProject, value: MOCK_PROJECT_OVERVIEW },
            { selector: ProjectOverviewSelectors.isProjectAnonymous, value: false },
            { selector: RegistryOverviewSelectors.getRegistry, value: undefined },
            { selector: RegistryOverviewSelectors.isRegistryAnonymous, value: false },
          ],
        }),
        MockProvider(CustomDialogService, mockCustomDialogService),
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, activatedRouteMock),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDuplicatesComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open ForkDialog with width 450px when small and not refresh on failure', () => {
    (component as any).actions = { ...component.actions, getDuplicates: jest.fn() };

    const openSpy = jest
      .spyOn(mockCustomDialogService, 'open')
      .mockReturnValue({ onClose: of({ success: false }) } as any);

    component.handleForkResource();

    expect(openSpy).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({ width: '450px' }));
    expect((component as any).actions.getDuplicates).not.toHaveBeenCalled();
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
