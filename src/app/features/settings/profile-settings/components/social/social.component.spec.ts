import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@osf/core/store/user';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { AuthenticatedIdentityComponent } from '../authenticated-identity/authenticated-identity.component';
import { SocialFormComponent } from '../social-form/social-form.component';

import { SocialComponent } from './social.component';

describe('SocialComponent', () => {
  let component: SocialComponent;
  let fixture: ComponentFixture<SocialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SocialComponent, ...MockComponents(SocialFormComponent, AuthenticatedIdentityComponent)],
      providers: [
        provideOSFCore(),
        provideMockStore({ signals: [{ selector: UserSelectors.getSocialLinks, value: MOCK_USER.social }] }),
        MockProvider(ToastService),
        MockProvider(LoaderService),
        MockProvider(CustomConfirmationService),
      ],
    });

    fixture = TestBed.createComponent(SocialComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
