import { MockComponents, MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { RegistryOverviewSelectors } from '@osf/features/registry/store/registry-overview';
import { ResourceType } from '@osf/shared/enums';
import { IS_SMALL } from '@osf/shared/helpers';
import { DuplicatesSelectors } from '@osf/shared/stores';
import {
  ContributorsListComponent,
  CustomPaginatorComponent,
  IconComponent,
  LoadingSpinnerComponent,
  SubHeaderComponent,
  TruncatedTextComponent,
} from '@shared/components';
import { MOCK_PROJECT_OVERVIEW } from '@shared/mocks';

import { ViewDuplicatesComponent } from './view-duplicates.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('Component: View Duplicates', () => {
  let component: ViewDuplicatesComponent;
  let fixture: ComponentFixture<ViewDuplicatesComponent>;
  let dialogService: DialogService;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let activatedRouteMock: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
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
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, activatedRouteMock),
        { provide: IS_SMALL, useValue: of(false) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDuplicatesComponent);
    component = fixture.componentInstance;

    dialogService = fixture.debugElement.injector.get(DialogService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open ForkDialog with width 95vw and refresh on success', () => {
    const openSpy = jest.spyOn(dialogService, 'open').mockReturnValue({ onClose: of({ success: true }) } as any);
    (component as any).actions = { ...component.actions, getDuplicates: jest.fn() };

    component.handleForkResource();

    expect(openSpy).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        width: '95vw',
        focusOnShow: false,
        header: 'project.overview.dialog.fork.headerProject',
        closeOnEscape: true,
        modal: true,
        closable: true,
        data: expect.objectContaining({
          resource: expect.any(Object),
          resourceType: ResourceType.Project,
        }),
      })
    );

    expect((component as any).actions.getDuplicates).toHaveBeenCalled();
  });

  it('should open ForkDialog with width 450px when small and not refresh on failure', () => {
    (component as any).isSmall = () => true;
    (component as any).actions = { ...component.actions, getDuplicates: jest.fn() };

    const openSpy = jest.spyOn(dialogService, 'open').mockReturnValue({ onClose: of({ success: false }) } as any);

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
