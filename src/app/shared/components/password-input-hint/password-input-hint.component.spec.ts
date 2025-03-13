import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordInputHintComponent } from './password-input-hint.component';

describe('PasswordInputHintComponent', () => {
  let component: PasswordInputHintComponent;
  let fixture: ComponentFixture<PasswordInputHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordInputHintComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordInputHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
