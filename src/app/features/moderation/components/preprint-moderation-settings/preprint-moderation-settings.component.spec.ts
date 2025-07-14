import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintModerationSettingsComponent } from './preprint-moderation-settings.component';

describe('PreprintModerationSettingsComponent', () => {
  let component: PreprintModerationSettingsComponent;
  let fixture: ComponentFixture<PreprintModerationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintModerationSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintModerationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
