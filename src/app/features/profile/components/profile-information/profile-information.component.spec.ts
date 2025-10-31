import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationHistoryComponent } from '@osf/shared/components/education-history/education-history.component';
import { EmploymentHistoryComponent } from '@osf/shared/components/employment-history/employment-history.component';
import { IS_MEDIUM } from '@osf/shared/helpers/breakpoints.tokens';
import { SocialModel } from '@shared/models/user/social.model';
import { UserModel } from '@shared/models/user/user.models';

import { ProfileInformationComponent } from './profile-information.component';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { MOCK_EDUCATION, MOCK_EMPLOYMENT } from '@testing/mocks/user-employment-education.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ProfileInformationComponent', () => {
  let component: ProfileInformationComponent;
  let fixture: ComponentFixture<ProfileInformationComponent>;

  const mockUser: UserModel = MOCK_USER;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProfileInformationComponent,
        OSFTestingModule,
        ...MockComponents(EmploymentHistoryComponent, EducationHistoryComponent),
      ],
      providers: [MockProvider(IS_MEDIUM, of(false))],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default inputs', () => {
    expect(component.currentUser()).toBeUndefined();
    expect(component.showEdit()).toBe(false);
  });

  it('should accept user input', () => {
    fixture.componentRef.setInput('currentUser', mockUser);
    fixture.detectChanges();
    expect(component.currentUser()).toEqual(mockUser);
  });

  it('should accept showEdit input', () => {
    fixture.componentRef.setInput('showEdit', true);
    fixture.detectChanges();
    expect(component.showEdit()).toBe(true);
  });

  it('should return true when user has employment', () => {
    fixture.componentRef.setInput('currentUser', {
      ...mockUser,
      employment: MOCK_EMPLOYMENT,
      education: [],
    });
    fixture.detectChanges();
    expect(component.isEmploymentAndEducationVisible()).toBeTruthy();
  });

  it('should return true when user has education', () => {
    fixture.componentRef.setInput('currentUser', {
      ...mockUser,
      employment: [],
      education: MOCK_EDUCATION,
    });
    fixture.detectChanges();
    expect(component.isEmploymentAndEducationVisible()).toBeTruthy();
  });

  it('should return true when user has both employment and education', () => {
    fixture.componentRef.setInput('currentUser', mockUser);
    fixture.detectChanges();
    expect(component.isEmploymentAndEducationVisible()).toBeTruthy();
  });

  it('should return falsy when user has neither employment nor education', () => {
    fixture.componentRef.setInput('currentUser', {
      ...mockUser,
      employment: [],
      education: [],
    });
    fixture.detectChanges();
    expect(component.isEmploymentAndEducationVisible()).toBeFalsy();
  });

  it('should return falsy when currentUser is null', () => {
    fixture.componentRef.setInput('currentUser', null);
    fixture.detectChanges();
    expect(component.isEmploymentAndEducationVisible()).toBeFalsy();
  });

  it('should map user social data to view models', () => {
    fixture.componentRef.setInput('currentUser', mockUser);
    fixture.detectChanges();

    const socials = component.userSocials();
    expect(socials).toBeDefined();
    expect(socials.length).toBeGreaterThan(0);
  });

  it('should include GitHub social link when present', () => {
    fixture.componentRef.setInput('currentUser', mockUser);
    fixture.detectChanges();

    const socials = component.userSocials();
    const github = socials.find((s) => s.icon.includes('github'));
    expect(github).toBeDefined();
    expect(github?.url).toContain('github.com');
  });

  it('should include Twitter social link when present', () => {
    fixture.componentRef.setInput('currentUser', mockUser);
    fixture.detectChanges();

    const socials = component.userSocials();
    const twitter = socials.find((s) => s.icon.includes('x.svg'));
    expect(twitter).toBeDefined();
    expect(twitter?.url).toContain('x.com');
  });

  it('should include LinkedIn social link when present', () => {
    fixture.componentRef.setInput('currentUser', mockUser);
    fixture.detectChanges();

    const socials = component.userSocials();
    const linkedin = socials.find((s) => s.icon.includes('linkedin'));
    expect(linkedin).toBeDefined();
    expect(linkedin?.url).toContain('linkedin.com');
  });

  it('should return empty array when user has no social data', () => {
    fixture.componentRef.setInput('currentUser', {
      ...mockUser,
      social: {} as SocialModel,
    });
    fixture.detectChanges();

    const socials = component.userSocials();
    expect(socials).toEqual([]);
  });

  it('should return empty array when currentUser is null', () => {
    fixture.componentRef.setInput('currentUser', null);
    fixture.detectChanges();

    const socials = component.userSocials();
    expect(socials).toEqual([]);
  });

  it('should emit editProfile event when called', (done) => {
    component.editProfile.subscribe(() => {
      expect(true).toBe(true);
      done();
    });

    component.toProfileSettings();
  });

  it('should emit editProfile event on button click', () => {
    jest.spyOn(component.editProfile, 'emit');
    component.toProfileSettings();
    expect(component.editProfile.emit).toHaveBeenCalled();
  });
});
