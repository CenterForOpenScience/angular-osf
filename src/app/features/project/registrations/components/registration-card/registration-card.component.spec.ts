import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationCardComponent } from './registration-card.component';

describe('RegistrationCardComponent', () => {
  let component: RegistrationCardComponent;
  let fixture: ComponentFixture<RegistrationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
