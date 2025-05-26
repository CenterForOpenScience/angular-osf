import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordInputHintComponent } from '@osf/shared/components';

import { ResetPasswordComponent } from './reset-password.component';

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
      providers: [
        {
          provide: TranslateService,
          useValue: {
            get: () => of(''),
            instant: (key: string) => key,
            onLangChange: of({ lang: 'en' }),
            onTranslationChange: of({ translations: {} }),
            onDefaultLangChange: of({ lang: 'en' }),
            setDefaultLang: jest.fn(),
            use: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
