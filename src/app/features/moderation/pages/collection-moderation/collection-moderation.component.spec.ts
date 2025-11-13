import { MockComponents, MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectComponent } from '@osf/shared/components/select/select.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { IS_MEDIUM } from '@osf/shared/helpers/breakpoints.tokens';

import { CollectionModerationTab } from '../../enums';

import { CollectionModerationComponent } from './collection-moderation.component';

import { OSFTestingStoreModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';

describe('Component: Collection Moderation', () => {
  let component: CollectionModerationComponent;
  let fixture: ComponentFixture<CollectionModerationComponent>;
  let isMediumSubject: BehaviorSubject<boolean>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
    isMediumSubject = new BehaviorSubject<boolean>(true);
    mockRouter = RouterMockBuilder.create().build();
    mockActivatedRoute = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: 'test-provider-id' })
      .withData({ tab: CollectionModerationTab.AllItems })
      .build();

    await TestBed.configureTestingModule({
      imports: [
        CollectionModerationComponent,
        OSFTestingStoreModule,
        ...MockComponents(SubHeaderComponent, SelectComponent),
      ],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        MockProvider(IS_MEDIUM, isMediumSubject),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedTab).toBeUndefined();
    expect(component.tabOptions).toBeDefined();
    expect(component.isMedium).toBeDefined();
  });

  it('should initialize selected tab from route data', async () => {
    const mockFirstChild = {
      data: { tab: CollectionModerationTab.Moderators },
    };

    const routeWithFirstChild = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: 'test-provider-id' })
      .build();

    Object.defineProperty(routeWithFirstChild.snapshot, 'firstChild', {
      value: mockFirstChild,
      writable: true,
    });

    await TestBed.configureTestingModule({
      imports: [
        CollectionModerationComponent,
        OSFTestingStoreModule,
        ...MockComponents(SubHeaderComponent, SelectComponent),
      ],
      providers: [
        MockProvider(ActivatedRoute, routeWithFirstChild),
        MockProvider(Router, mockRouter),
        MockProvider(IS_MEDIUM, isMediumSubject),
      ],
    }).compileComponents();

    const testFixture = TestBed.createComponent(CollectionModerationComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.ngOnInit();

    expect(testComponent.selectedTab).toBe(CollectionModerationTab.Moderators);
  });

  it('should navigate to not-found when providerId is missing', async () => {
    const routeWithoutProviderId = ActivatedRouteMockBuilder.create().withParams({}).build();

    await TestBed.configureTestingModule({
      imports: [
        CollectionModerationComponent,
        OSFTestingStoreModule,
        ...MockComponents(SubHeaderComponent, SelectComponent),
      ],
      providers: [
        MockProvider(ActivatedRoute, routeWithoutProviderId),
        MockProvider(Router, mockRouter),
        MockProvider(IS_MEDIUM, isMediumSubject),
      ],
    }).compileComponents();

    const testFixture = TestBed.createComponent(CollectionModerationComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/not-found']);
  });

  it('should call getCollectionProvider action on init when providerId exists', () => {
    const getCollectionProviderSpy = jest.fn();
    component.actions = {
      ...component.actions,
      getCollectionProvider: getCollectionProviderSpy,
    };

    component.ngOnInit();

    expect(getCollectionProviderSpy).toHaveBeenCalledWith('test-provider-id');
  });

  it('should handle tab change and navigate to new tab', () => {
    const newTab = CollectionModerationTab.Moderators;

    component.onTabChange(newTab);

    expect(component.selectedTab).toBe(newTab);
    expect(mockRouter.navigate).toHaveBeenCalledWith([newTab], { relativeTo: expect.any(Object) });
  });

  it('should call clearCurrentProvider on destroy', () => {
    const clearCurrentProviderSpy = jest.fn();
    component.actions = {
      ...component.actions,
      clearCurrentProvider: clearCurrentProviderSpy,
    };

    component.ngOnDestroy();

    expect(clearCurrentProviderSpy).toHaveBeenCalled();
  });

  it('should have actions defined', () => {
    expect(component.actions).toBeDefined();
    expect(component.actions.getCollectionProvider).toBeDefined();
    expect(component.actions.clearCurrentProvider).toBeDefined();
  });

  it('should have tab options defined', () => {
    expect(component.tabOptions).toBeDefined();
    expect(component.tabOptions.length).toBeGreaterThan(0);
  });

  it('should handle isMedium observable', () => {
    expect(component.isMedium()).toBe(true);

    isMediumSubject.next(false);
    fixture.detectChanges();

    expect(component.isMedium()).toBe(false);
  });

  it('should handle tab change with different tab values', () => {
    const tabs = [
      CollectionModerationTab.AllItems,
      CollectionModerationTab.Moderators,
      CollectionModerationTab.Settings,
    ];

    tabs.forEach((tab) => {
      component.onTabChange(tab);
      expect(component.selectedTab).toBe(tab);
      expect(mockRouter.navigate).toHaveBeenCalledWith([tab], { relativeTo: expect.any(Object) });
    });
  });

  it('should not navigate when providerId is present', () => {
    mockActivatedRoute = ActivatedRouteMockBuilder.create().withParams({ providerId: 'valid-id' }).build();

    component.ngOnInit();

    expect(mockRouter.navigate).not.toHaveBeenCalledWith(['/not-found']);
  });
});
