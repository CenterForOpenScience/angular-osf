import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonCardListComponent } from '@osf/shared/components/addons/addon-card-list/addon-card-list.component';
import { AddonsToolbarComponent } from '@osf/shared/components/addons/addons-toolbar/addons-toolbar.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { SettingsAddonsComponent } from './settings-addons.component';

describe.skip('AddonsComponent', () => {
  let component: SettingsAddonsComponent;
  let fixture: ComponentFixture<SettingsAddonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
      providers: [provideOSFCore(), provideMockStore()],
    });

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
