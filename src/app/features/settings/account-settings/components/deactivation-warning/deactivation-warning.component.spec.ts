import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivationWarningComponent } from './deactivation-warning.component';

describe('DeactivationWarningComponent', () => {
  let component: DeactivationWarningComponent;
  let fixture: ComponentFixture<DeactivationWarningComponent>;
  let dialogRef: DynamicDialogRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeactivationWarningComponent, MockPipe(TranslatePipe)],
      providers: [MockProvider(DynamicDialogRef)],
    }).compileComponents();

    fixture = TestBed.createComponent(DeactivationWarningComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DynamicDialogRef);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog when deactivateAccount is called', () => {
    const closeSpy = jest.spyOn(dialogRef, 'close');

    component.deactivateAccount();

    expect(closeSpy).toHaveBeenCalledWith(true);
  });
});
