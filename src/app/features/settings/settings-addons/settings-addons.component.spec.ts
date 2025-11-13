import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors } from '@osf/core/store/user';
import { AddonCardListComponent } from '@osf/shared/components/addons/addon-card-list/addon-card-list.component';
import { AddonsToolbarComponent } from '@osf/shared/components/addons/addons-toolbar/addons-toolbar.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { AddonsSelectors } from '@shared/stores/addons';

import { SettingsAddonsComponent } from './settings-addons.component';

import { TranslateServiceMock } from '@testing/mocks/translate.service.mock';

describe.skip('AddonsComponent', () => {
  let component: SettingsAddonsComponent;
  let fixture: ComponentFixture<SettingsAddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SettingsAddonsComponent,
        ...MockComponents(
          SubHeaderComponent,
          AddonsToolbarComponent,
          AddonCardListComponent,
          LoadingSpinnerComponent,
          SelectComponent
        ),
      ],
      providers: [
        TranslateServiceMock,
        MockProvider(Store, {
          selectSignal: jest.fn().mockImplementation((selector) => {
            if (selector === UserSelectors.getCurrentUser) {
              return () => ({ id: 'test-user-id' });
            }
            if (selector === AddonsSelectors.getAddonsUserReference) {
              return () => [{ id: 'test-reference-id' }];
            }
            if (selector === AddonsSelectors.getStorageAddons) {
              return () => [];
            }
            if (selector === AddonsSelectors.getCitationAddons) {
              return () => [];
            }
            if (selector === AddonsSelectors.getAuthorizedStorageAddons) {
              return () => [];
            }
            if (selector === AddonsSelectors.getAuthorizedCitationAddons) {
              return () => [];
            }
            return () => null;
          }),
          dispatch: jest.fn(),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the connected description paragraph', () => {
    component['selectedTab'].set(component['AddonTabValue'].ALL_ADDONS);
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    const p = compiled.querySelector('p');
    expect(p).toBeTruthy();
    expect(p?.textContent?.trim()).toContain('settings.addons.description');
  });

  it('should render the connected description paragraph', () => {
    component['selectedTab'].set(component['AddonTabValue'].CONNECTED_ADDONS);
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    const p = compiled.querySelector('p');
    expect(p).toBeTruthy();
    expect(p?.textContent?.trim()).toContain('settings.addons.connectedDescription');
  });
});
