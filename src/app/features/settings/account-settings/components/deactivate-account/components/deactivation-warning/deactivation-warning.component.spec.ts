import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivationWarningComponent } from './deactivation-warning.component';

describe('DeactivationWarningComponent', () => {
  let component: DeactivationWarningComponent;
  let fixture: ComponentFixture<DeactivationWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeactivationWarningComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeactivationWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
