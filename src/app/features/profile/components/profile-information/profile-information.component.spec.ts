import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EducationHistoryComponent } from '@osf/shared/components/education-history/education-history.component';
import { EmploymentHistoryComponent } from '@osf/shared/components/employment-history/employment-history.component';
import { ExternalIdentityStatus } from '@osf/shared/enums/external-identity-status.enum';
import { IS_MEDIUM } from '@osf/shared/helpers/breakpoints.tokens';
import { Institution } from '@osf/shared/models/institutions/institutions.model';
import { UserModel } from '@osf/shared/models/user/user.model';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';

import { ProfileInformationComponent } from './profile-information.component';

describe('ProfileInformationComponent', () => {
  let component: ProfileInformationComponent;
  let fixture: ComponentFixture<ProfileInformationComponent>;

  const institutions: Institution[] = [
    {
      id: 'inst-1',
      type: 'institutions',
      name: 'Institution One',
      description: 'Test institution',
      iri: 'https://api.test.osf.io/v2/institutions/inst-1/',
      rorIri: null,
      iris: ['https://api.test.osf.io/v2/institutions/inst-1/'],
      assets: {
        logo: 'logo.png',
        logo_rounded: 'logo-rounded.png',
        banner: 'banner.png',
      },
      institutionalRequestAccessEnabled: true,
      logoPath: 'logo.png',
    },
  ];

  function setup(user: UserModel | null = MOCK_USER) {
    TestBed.configureTestingModule({
      imports: [ProfileInformationComponent, ...MockComponents(EmploymentHistoryComponent, EducationHistoryComponent)],
      providers: [provideOSFCore(), provideRouter([]), MockProvider(IS_MEDIUM, of(true))],
    });

    fixture = TestBed.createComponent(ProfileInformationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('currentUser', user);
    fixture.componentRef.setInput('currentUserInstitutions', institutions);
    fixture.componentRef.setInput('showEdit', true);
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should show employment and education section when user has records', () => {
    setup();

    expect(component.isEmploymentAndEducationVisible()).toBeTruthy();
  });

  it('should hide employment and education section when user has no records', () => {
    setup({
      ...MOCK_USER,
      employment: [],
      education: [],
    });

    expect(component.isEmploymentAndEducationVisible()).toBeFalsy();
  });

  it('should map socials from current user', () => {
    setup();

    expect(component.userSocials().length).toBeGreaterThan(0);
  });

  it('should return empty socials when current user is missing', () => {
    setup(null);

    expect(component.userSocials()).toEqual([]);
  });

  it('should expose ORCID id only when verified', () => {
    setup({
      ...MOCK_USER,
      external_identity: {
        ORCID: {
          id: '0000-0002-1825-0097',
          status: ExternalIdentityStatus.VERIFIED,
        },
      },
    } as UserModel);

    expect(component.orcidId()).toBe('0000-0002-1825-0097');
  });

  it('should return undefined ORCID when status is not verified', () => {
    setup({
      ...MOCK_USER,
      external_identity: {
        ORCID: {
          id: '0000-0002-1825-0097',
          status: ExternalIdentityStatus.LINK,
        },
      },
    } as UserModel);

    expect(component.orcidId()).toBeUndefined();
  });

  it('should emit editProfile when navigating to profile settings', () => {
    setup();
    const emitSpy = vi.spyOn(component.editProfile, 'emit');

    component.toProfileSettings();

    expect(emitSpy).toHaveBeenCalled();
  });
});
