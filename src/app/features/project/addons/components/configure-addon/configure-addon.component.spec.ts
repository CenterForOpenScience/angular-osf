import { provideStore } from '@ngxs/store';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonsState } from '@osf/shared/stores';

import { ConfigureAddonComponent } from './configure-addon.component';

import { ToastServiceMock } from '@testing/mocks/toast.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Component: Configure Addon', () => {
  let component: ConfigureAddonComponent;
  let fixture: ComponentFixture<ConfigureAddonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OSFTestingModule, ConfigureAddonComponent],
      providers: [provideStore([AddonsState]), ToastServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigureAddonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
