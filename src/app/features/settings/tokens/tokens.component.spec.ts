import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomDialogServiceMock, CustomDialogServiceMockType } from '@testing/providers/custom-dialog-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { TokenAddEditFormComponent } from './components';
import { GetScopes } from './store';
import { TokensComponent } from './tokens.component';

interface SetupOverrides {
  url?: string;
}

describe('TokensComponent', () => {
  let component: TokensComponent;
  let fixture: ComponentFixture<TokensComponent>;
  let store: Store;
  let customDialogService: CustomDialogServiceMockType;
  let routerMock: RouterMockType;

  function setup(overrides: SetupOverrides = {}) {
    customDialogService = CustomDialogServiceMock.simple();

    routerMock = RouterMockBuilder.create()
      .withUrl(overrides.url ?? '/settings/tokens')
      .build();

    TestBed.configureTestingModule({
      imports: [TokensComponent, ...MockComponents(SubHeaderComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(Router, routerMock),
        MockProvider(CustomDialogService, customDialogService),
        provideMockStore(),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(TokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should dispatch get scopes on init', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new GetScopes());
  });

  it('should open create token dialog with expected config', () => {
    setup();

    component.createToken();

    expect(customDialogService.open).toHaveBeenCalledWith(TokenAddEditFormComponent, {
      header: 'settings.tokens.form.createTitle',
      width: '800px',
    });
  });

  it('should set isBaseRoute true initially for base tokens route', () => {
    setup({ url: '/settings/tokens' });

    expect(component.isBaseRoute()).toBe(true);
  });

  it('should set isBaseRoute false initially for nested tokens route', () => {
    setup({ url: '/settings/tokens/token-1' });

    expect(component.isBaseRoute()).toBe(false);
  });
});
