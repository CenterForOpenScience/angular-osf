import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsViewOnlyLinksCardComponent } from './settings-view-only-links-card.component';

describe('SettingsViewOnlyLinksCardComponent', () => {
  let component: SettingsViewOnlyLinksCardComponent;
  let fixture: ComponentFixture<SettingsViewOnlyLinksCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsViewOnlyLinksCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsViewOnlyLinksCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
