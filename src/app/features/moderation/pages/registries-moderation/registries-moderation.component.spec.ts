import { MockComponents, MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { IS_MEDIUM } from '@osf/shared/helpers';
import { SelectComponent, SubHeaderComponent } from '@shared/components';

import { RegistryModerationTab } from '../../enums';

import { RegistriesModerationComponent } from './registries-moderation.component';

import { OSFTestingStoreModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';

describe('RegistriesModerationComponent', () => {
  let component: RegistriesModerationComponent;
  let fixture: ComponentFixture<RegistriesModerationComponent>;
  let isMediumSubject: BehaviorSubject<boolean>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;
  let mockActivatedRoute: ReturnType<ActivatedRouteMockBuilder['build']>;

  beforeEach(async () => {
    isMediumSubject = new BehaviorSubject<boolean>(true);
    mockRouter = RouterMockBuilder.create().build();
    mockActivatedRoute = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: 'test-provider-id' })
      .withData({ tab: RegistryModerationTab.Submitted })
      .build();

    await TestBed.configureTestingModule({
      imports: [
        RegistriesModerationComponent,
        OSFTestingStoreModule,
        ...MockComponents(SubHeaderComponent, SelectComponent),
      ],
      providers: [
        MockProvider(ActivatedRoute, mockActivatedRoute),
        MockProvider(Router, mockRouter),
        MockProvider(IS_MEDIUM, isMediumSubject),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.resourceType).toBe(3);
    expect(component.selectedTab).toBeUndefined();
    expect(component.tabOptions).toBeDefined();
    expect(component.isMedium).toBeDefined();
  });

  it('should call getProvider action on init when providerId exists', () => {
    const getProviderSpy = jest.fn();
    component.actions = {
      ...component.actions,
      getProvider: getProviderSpy,
    };

    component.ngOnInit();

    expect(getProviderSpy).toHaveBeenCalledWith('test-provider-id');
  });

  it('should handle tab change and navigate to new tab', () => {
    const newTab = RegistryModerationTab.Settings;

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

  it('should handle isMedium observable', () => {
    expect(component.isMedium()).toBe(true);

    isMediumSubject.next(false);
    fixture.detectChanges();

    expect(component.isMedium()).toBe(false);
  });

  it('should handle tab change with different tab values', () => {
    const tabs = [RegistryModerationTab.Submitted, RegistryModerationTab.Settings];

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

  it('should handle tab change with string values', () => {
    const stringTab = 'submitted' as any;

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
});
