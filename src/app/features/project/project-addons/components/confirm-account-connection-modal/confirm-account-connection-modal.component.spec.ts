import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { ConfirmAccountConnectionModalComponent } from './confirm-account-connection-modal.component';

describe.skip('ConfirmAccountConnectionModalComponent', () => {
  let component: ConfirmAccountConnectionModalComponent;
  let fixture: ComponentFixture<ConfirmAccountConnectionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmAccountConnectionModalComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(ConfirmAccountConnectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
