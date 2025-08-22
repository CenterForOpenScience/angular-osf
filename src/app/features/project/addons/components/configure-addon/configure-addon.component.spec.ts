import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureAddonComponent } from './configure-addon.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Component: Configure Addon', () => {
  let component: ConfigureAddonComponent;
  let fixture: ComponentFixture<ConfigureAddonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OSFTestingModule, ConfigureAddonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigureAddonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
