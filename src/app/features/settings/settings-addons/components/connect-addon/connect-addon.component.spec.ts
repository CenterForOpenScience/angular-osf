import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Navigation, Router, UrlTree } from '@angular/router';

import { AddonSetupAccountFormComponent } from '@osf/shared/components/addons/addon-setup-account-form/addon-setup-account-form.component';
import { AddonTermsComponent } from '@osf/shared/components/addons/addon-terms/addon-terms.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { AddonsSelectors } from '@shared/stores/addons';

import { ConnectAddonComponent } from './connect-addon.component';

import { MOCK_ADDON } from '@testing/mocks/addon.mock';

describe.skip('ConnectAddonComponent', () => {
  let component: ConnectAddonComponent;
  let fixture: ComponentFixture<ConnectAddonComponent>;

  beforeEach(async () => {
    const mockNavigation: Partial<Navigation> = {
      id: 1,
      initialUrl: new UrlTree(),
      extractedUrl: new UrlTree(),
      trigger: 'imperative',
      previousNavigation: null,
      extras: {
        state: { addon: MOCK_ADDON },
      },
    };

    await TestBed.configureTestingModule({
      imports: [
        ConnectAddonComponent,
        ...MockComponents(SubHeaderComponent, AddonTermsComponent, AddonSetupAccountFormComponent),
        MockPipe(TranslatePipe),
      ],
      providers: [
        provideNoopAnimations(),
        MockProvider(Store, {
          selectSignal: jest.fn().mockImplementation((selector) => {
            if (selector === AddonsSelectors.getAddonsUserReference) {
              return () => [{ id: 'test-user-id' }];
            }
            if (selector === AddonsSelectors.getCreatedOrUpdatedAuthorizedAddon) {
              return () => null;
            }
            return () => null;
          }),
          dispatch: jest.fn().mockReturnValue(of({})),
        }),
        MockProvider(Router, {
          getCurrentNavigation: () => mockNavigation as Navigation,
          navigate: jest.fn(),
        }),
        MockProvider(TranslateService),
        MockProvider(ActivatedRoute),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectAddonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize with addon data from router state', () => {
    expect(component).toBeTruthy();
    expect(component['addon']()).toEqual(MOCK_ADDON);
    expect(component['terms']().length).toBeGreaterThan(0);
  });
});
