import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsAccessRequestsCardComponent } from './settings-access-requests-card.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('SettingsAccessRequestsCardComponent', () => {
  let component: SettingsAccessRequestsCardComponent;
  let fixture: ComponentFixture<SettingsAccessRequestsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsAccessRequestsCardComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsAccessRequestsCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('accessRequest', true);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with accessRequest input', () => {
    const testValue = true;
    fixture.componentRef.setInput('accessRequest', testValue);
    fixture.detectChanges();

    expect(component.accessRequest()).toBe(testValue);
  });

  it('should emit accessRequestChange when checkbox value changes', () => {
    jest.spyOn(component.accessRequestChange, 'emit');
    fixture.componentRef.setInput('accessRequest', false);
    fixture.detectChanges();

    const newValue = true;
    component.accessRequestChange.emit(newValue);

    expect(component.accessRequestChange.emit).toHaveBeenCalledWith(newValue);
  });
});
