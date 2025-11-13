import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from '@core/services/auth.service';
import { TextInputComponent } from '@osf/shared/components/text-input/text-input.component';

import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, MockPipe(TranslatePipe), MockComponent(TextInputComponent)],
      providers: [MockProvider(TranslateService), MockProvider(AuthService)],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
