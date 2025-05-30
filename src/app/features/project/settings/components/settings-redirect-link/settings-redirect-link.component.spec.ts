import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsRedirectLinkComponent } from './settings-redirect-link.component';

describe('SettingsRedirectLinkComponent', () => {
  let component: SettingsRedirectLinkComponent;
  let fixture: ComponentFixture<SettingsRedirectLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsRedirectLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsRedirectLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
