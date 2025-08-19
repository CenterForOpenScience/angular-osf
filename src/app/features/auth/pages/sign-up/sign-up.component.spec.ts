import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '@osf/core/services';
import { PasswordInputHintComponent } from '@osf/shared/components';
import { TranslateServiceMock } from '@shared/mocks';

import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpComponent, MockComponent(PasswordInputHintComponent), MockPipe(TranslatePipe)],
      providers: [TranslateServiceMock, MockProvider(ActivatedRoute), MockProvider(AuthService)],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
