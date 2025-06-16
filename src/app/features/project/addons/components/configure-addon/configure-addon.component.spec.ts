import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureAddonComponent } from './configure-addon.component';

describe('ConfigureAddonComponent', () => {
  let component: ConfigureAddonComponent;
  let fixture: ComponentFixture<ConfigureAddonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigureAddonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigureAddonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
