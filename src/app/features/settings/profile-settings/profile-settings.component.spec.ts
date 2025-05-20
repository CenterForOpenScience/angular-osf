import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { EducationComponent } from '@osf/features/settings/profile-settings/education/education.component';
import { EmploymentComponent } from '@osf/features/settings/profile-settings/employment/employment.component';
import { NameComponent } from '@osf/features/settings/profile-settings/name/name.component';
import { SocialComponent } from '@osf/features/settings/profile-settings/social/social.component';
import { IS_XSMALL } from '@osf/shared/utils/breakpoints.tokens';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';

import { ProfileSettingsComponent } from './profile-settings.component';

describe('ProfileSettingsComponent', () => {
  let component: ProfileSettingsComponent;
  let fixture: ComponentFixture<ProfileSettingsComponent>;
  let isXSmall: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isXSmall = new BehaviorSubject<boolean>(false);

    await TestBed.configureTestingModule({
      imports: [
        ProfileSettingsComponent,
        MockPipe(TranslatePipe),
        ...MockComponents(SubHeaderComponent, NameComponent, SocialComponent, EmploymentComponent, EducationComponent),
      ],
      providers: [MockProvider(IS_XSMALL, isXSmall), MockProvider(TranslateService)],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default tab value', () => {
    expect(fixture.componentInstance['selectedTab']).toBe(fixture.componentInstance['defaultTabValue']);
  });

  it('should update selected tab when onTabChange is called', () => {
    const newTabIndex = 2;
    component.onTabChange(newTabIndex);
    expect(fixture.componentInstance['selectedTab']).toBe(newTabIndex);
  });

  it('should display all tab options', () => {
    const tabElements = fixture.debugElement.queryAll(By.css('p-tab'));
    expect(tabElements.length).toBe(fixture.componentInstance['tabOptions'].length);
  });

  it('should show select dropdown in mobile view', () => {
    isXSmall.next(true);
    fixture.detectChanges();

    const selectElement = fixture.debugElement.query(By.css('p-select'));
    expect(selectElement).toBeTruthy();
  });

  it('should hide tab list in mobile view', () => {
    isXSmall.next(true);
    fixture.detectChanges();

    const tabListElement = fixture.debugElement.query(By.css('p-tablist'));
    expect(tabListElement).toBeFalsy();
  });

  it('should show tab list in desktop view', () => {
    isXSmall.next(false);
    fixture.detectChanges();

    const tabListElement = fixture.debugElement.query(By.css('p-tablist'));
    expect(tabListElement).toBeTruthy();
  });

  it('should render all tab panels', () => {
    const tabPanels = fixture.debugElement.queryAll(By.css('p-tabpanel'));
    expect(tabPanels.length).toBe(4);
  });

  it('should render name component in first tab panel', () => {
    const nameComponent = fixture.debugElement.query(By.directive(NameComponent));
    expect(nameComponent).toBeTruthy();
  });
});
