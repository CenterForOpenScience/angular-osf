import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordInputHintComponent } from './password-input-hint.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('PasswordInputHintComponent', () => {
  let component: PasswordInputHintComponent;
  let fixture: ComponentFixture<PasswordInputHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordInputHintComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordInputHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display password requirements text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const smallElement = compiled.querySelector('small');
    expect(smallElement).toBeTruthy();
  });
});
