import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordInputHintComponent } from './password-input-hint.component';

describe('PasswordInputHintComponent', () => {
  let component: PasswordInputHintComponent;
  let fixture: ComponentFixture<PasswordInputHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordInputHintComponent, MockPipe(TranslatePipe)],
      providers: [MockProvider(TranslateService)],
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
