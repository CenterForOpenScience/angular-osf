import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAccountConnectionModalComponent } from './confirm-account-connection-modal.component';

describe('ConfirmAccountConnectionModalComponent', () => {
  let component: ConfirmAccountConnectionModalComponent;
  let fixture: ComponentFixture<ConfirmAccountConnectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmAccountConnectionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmAccountConnectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
