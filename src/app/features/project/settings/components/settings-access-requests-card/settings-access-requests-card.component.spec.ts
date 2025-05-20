import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsAccessRequestsCardComponent } from './settings-access-requests-card.component';

describe('SettingsAccessRequestsCardComponent', () => {
  let component: SettingsAccessRequestsCardComponent;
  let fixture: ComponentFixture<SettingsAccessRequestsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsAccessRequestsCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsAccessRequestsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
