import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AddonSetupAccountFormComponent } from '@osf/shared/components/addons/addon-setup-account-form/addon-setup-account-form.component';
import { AddonTermsComponent } from '@osf/shared/components/addons/addon-terms/addon-terms.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';

import { MOCK_ADDON } from '@testing/mocks/addon.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { ConnectAddonComponent } from './connect-addon.component';

describe.skip('ConnectAddonComponent', () => {
  let component: ConnectAddonComponent;
  let fixture: ComponentFixture<ConnectAddonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ConnectAddonComponent,
        ...MockComponents(SubHeaderComponent, AddonTermsComponent, AddonSetupAccountFormComponent),
      ],
      providers: [provideOSFCore(), provideRouter([]), provideMockStore()],
    });

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
