import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsCommentingCardComponent } from './settings-commenting-card.component';

describe('SettingsCommentingCardComponent', () => {
  let component: SettingsCommentingCardComponent;
  let fixture: ComponentFixture<SettingsCommentingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsCommentingCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsCommentingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
