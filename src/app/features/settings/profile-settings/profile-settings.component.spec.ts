import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SelectComponent } from '@osf/shared/components/select/select.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { IS_MEDIUM } from '@osf/shared/helpers/breakpoints.tokens';

import { EducationComponent, EmploymentComponent, NameComponent, SocialComponent } from './components';
import { ProfileSettingsComponent } from './profile-settings.component';

describe('ProfileSettingsComponent', () => {
  let component: ProfileSettingsComponent;
  let fixture: ComponentFixture<ProfileSettingsComponent>;
  let isMedium: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isMedium = new BehaviorSubject<boolean>(false);

    await TestBed.configureTestingModule({
      imports: [
        ProfileSettingsComponent,
        MockPipe(TranslatePipe),
        ...MockComponents(
          SubHeaderComponent,
          EducationComponent,
          EmploymentComponent,
          NameComponent,
          SocialComponent,
          SelectComponent
        ),
      ],
      providers: [MockProvider(IS_MEDIUM, isMedium), MockProvider(TranslateService)],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update selected tab when onTabChange is called', () => {
    const newTabIndex = 2;
    component.onTabChange(newTabIndex);
    expect(fixture.componentInstance['selectedTab']).toBe(newTabIndex);
  });

  it('should display all tab options on medium screens', () => {
    isMedium.next(true);
    fixture.detectChanges();
    const tabElements = fixture.debugElement.queryAll(By.css('p-tab'));
    expect(tabElements.length).toBe(component['tabOptions'].length);
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
