import { MockComponents, MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { IS_MEDIUM } from '@osf/shared/helpers';
import { SelectComponent, SubHeaderComponent } from '@shared/components';

import { PreprintModerationTab } from '../../enums';

import { PreprintModerationComponent } from './preprint-moderation.component';

import { OSFTestingStoreModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';

describe('PreprintModerationComponent', () => {
  let component: PreprintModerationComponent;
  let fixture: ComponentFixture<PreprintModerationComponent>;
  let isMediumSubject: BehaviorSubject<boolean>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
    isMediumSubject = new BehaviorSubject<boolean>(true);
    mockRouter = RouterMockBuilder.create().build();
    mockActivatedRoute = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: 'test-provider-id' })
      .withData({ tab: PreprintModerationTab.Submissions })
      .build();

    await TestBed.configureTestingModule({
      imports: [
        PreprintModerationComponent,
        OSFTestingStoreModule,
        ...MockComponents(SubHeaderComponent, SelectComponent),
      ],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        MockProvider(IS_MEDIUM, isMediumSubject),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.resourceType).toBe(5);
    expect(component.selectedTab).toBeUndefined();
    expect(component.tabOptions).toBeDefined();
    expect(component.isMedium).toBeDefined();
  });

  it('should initialize selected tab from route data', async () => {
    const mockFirstChild = {
      data: { tab: PreprintModerationTab.Settings },
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
        PreprintModerationComponent,
        OSFTestingStoreModule,
        ...MockComponents(SubHeaderComponent, SelectComponent),
      ],
      providers: [
        MockProvider(ActivatedRoute, routeWithFirstChild),
        MockProvider(Router, mockRouter),
        MockProvider(IS_MEDIUM, isMediumSubject),
      ],
    }).compileComponents();

    const testFixture = TestBed.createComponent(PreprintModerationComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.ngOnInit();

    expect(testComponent.selectedTab).toBe(PreprintModerationTab.Settings);
  });

  it('should handle tab change and navigate to new tab', () => {
    const newTab = PreprintModerationTab.Settings;

    component.onTabChange(newTab);

    expect(component.selectedTab).toBe(newTab);
    expect(mockRouter.navigate).toHaveBeenCalledWith([newTab], { relativeTo: expect.any(Object) });
  });

  it('should handle tab change with different tab values', () => {
    const tabs = [PreprintModerationTab.Submissions, PreprintModerationTab.Settings];

    tabs.forEach((tab) => {
      component.onTabChange(tab);
      expect(component.selectedTab).toBe(tab);
      expect(mockRouter.navigate).toHaveBeenCalledWith([tab], { relativeTo: expect.any(Object) });
    });
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

  it('should have resourceType set to preprint', () => {
    expect(component.resourceType).toBe(5);
  });

  it('should handle tab change with string values', () => {
    const stringTab = 'submissions' as any;

    component.onTabChange(stringTab);

    expect(component.selectedTab).toBe(stringTab);
    expect(mockRouter.navigate).toHaveBeenCalledWith([stringTab], { relativeTo: expect.any(Object) });
  });

  it('should handle tab change with numeric values', () => {
    const numericTab = 1 as any;

    component.onTabChange(numericTab);

    expect(component.selectedTab).toBe(numericTab);
    expect(mockRouter.navigate).toHaveBeenCalledWith([numericTab], { relativeTo: expect.any(Object) });
  });

  it('should handle undefined firstChild in route data', async () => {
    const routeWithoutFirstChild = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: 'test-provider-id' })
      .build();

    Object.defineProperty(routeWithoutFirstChild.snapshot, 'firstChild', {
      value: undefined,
      writable: true,
    });

    await TestBed.configureTestingModule({
      imports: [
        PreprintModerationComponent,
        OSFTestingStoreModule,
        ...MockComponents(SubHeaderComponent, SelectComponent),
      ],
      providers: [
        MockProvider(ActivatedRoute, routeWithoutFirstChild),
        MockProvider(Router, mockRouter),
        MockProvider(IS_MEDIUM, isMediumSubject),
      ],
    }).compileComponents();

    const testFixture = TestBed.createComponent(PreprintModerationComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.ngOnInit();

    expect(testComponent.selectedTab).toBeUndefined();
  });
});
