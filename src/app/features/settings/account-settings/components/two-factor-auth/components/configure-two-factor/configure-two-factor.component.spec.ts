import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureTwoFactorComponent } from './configure-two-factor.component';

describe('ConfigureTwoFactorComponent', () => {
  let component: ConfigureTwoFactorComponent;
  let fixture: ComponentFixture<ConfigureTwoFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigureTwoFactorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigureTwoFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
