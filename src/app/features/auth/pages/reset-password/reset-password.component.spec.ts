import { TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from '@osf/features/auth/pages';
import { PasswordInputHintComponent } from '@osf/shared/components';
import { TranslateServiceMock } from '@osf/shared/mocks';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ResetPasswordComponent,
        MockComponent(PasswordInputHintComponent),
        MockPipe(TranslatePipe, (value) => value),
      ],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
