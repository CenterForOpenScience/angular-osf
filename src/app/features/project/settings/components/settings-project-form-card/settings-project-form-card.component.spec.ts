import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsProjectFormCardComponent } from './settings-project-form-card.component';

describe('SettingsProjectFormCardComponent', () => {
  let component: SettingsProjectFormCardComponent;
  let fixture: ComponentFixture<SettingsProjectFormCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsProjectFormCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsProjectFormCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
