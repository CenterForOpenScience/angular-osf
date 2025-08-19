import { TranslateService } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, Validators } from '@angular/forms';

import { ArrayInputComponent } from './array-input.component';

describe('ArrayInputComponent', () => {
  let component: ArrayInputComponent;
  let fixture: ComponentFixture<ArrayInputComponent>;
  const array = new FormArray<FormControl>([new FormControl('')]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrayInputComponent],
      providers: [MockProvider(TranslateService)],
    }).compileComponents();

    fixture = TestBed.createComponent(ArrayInputComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('formArray', array);
    fixture.componentRef.setInput('inputPlaceholder', '');
    fixture.componentRef.setInput('validators', [Validators.required]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
