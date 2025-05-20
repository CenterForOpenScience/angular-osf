import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsStorageLocationCardComponent } from './settings-storage-location-card.component';

describe('SettingsStorageLocationCardComponent', () => {
  let component: SettingsStorageLocationCardComponent;
  let fixture: ComponentFixture<SettingsStorageLocationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsStorageLocationCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsStorageLocationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
