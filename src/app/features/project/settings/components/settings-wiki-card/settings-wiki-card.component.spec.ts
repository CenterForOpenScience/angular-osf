import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsWikiCardComponent } from './settings-wiki-card.component';

describe('SettingsWikiCardComponent', () => {
  let component: SettingsWikiCardComponent;
  let fixture: ComponentFixture<SettingsWikiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsWikiCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsWikiCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
