import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { StorageItemSelectorComponent } from '@osf/shared/components/addons/storage-item-selector/storage-item-selector.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { ConfigureAddonComponent } from './configure-addon.component';

describe.skip('ConfigureAddonComponent', () => {
  let component: ConfigureAddonComponent;
  let fixture: ComponentFixture<ConfigureAddonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfigureAddonComponent, ...MockComponents(SubHeaderComponent, StorageItemSelectorComponent)],
      providers: [provideOSFCore(), provideMockStore(), MockProvider(Router), MockProvider(ActivatedRoute)],
    });

    fixture = TestBed.createComponent(ConfigureAddonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize with addon data from router state', () => {
    expect(component).toBeTruthy();
  });
});
