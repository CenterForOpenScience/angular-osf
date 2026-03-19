import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@osf/core/store/user';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { SocialFormComponent } from '../social-form/social-form.component';

import { SocialComponent } from './social.component';

import { MockCustomConfirmationServiceProvider } from '@testing/mocks/custom-confirmation.service.mock';
import { MOCK_USER } from '@testing/mocks/data.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('SocialComponent', () => {
  let component: SocialComponent;
  let fixture: ComponentFixture<SocialComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [SocialComponent, MockComponent(SocialFormComponent), MockPipe(TranslatePipe)],
      providers: [
        provideMockStore({
          signals: [{ selector: UserSelectors.getSocialLinks, value: MOCK_USER.social }],
        }),
        MockProvider(ToastService),
        MockProvider(LoaderService),
        { provide: CustomConfirmationService, useValue: MockCustomConfirmationServiceProvider },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
