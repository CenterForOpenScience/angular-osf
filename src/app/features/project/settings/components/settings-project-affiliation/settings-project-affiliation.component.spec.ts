import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsProjectAffiliationComponent } from './settings-project-affiliation.component';

describe('SettingsProjectAffiliationComponent', () => {
  let component: SettingsProjectAffiliationComponent;
  let fixture: ComponentFixture<SettingsProjectAffiliationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsProjectAffiliationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsProjectAffiliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
