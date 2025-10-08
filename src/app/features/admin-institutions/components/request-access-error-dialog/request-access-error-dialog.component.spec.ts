import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAccessErrorDialogComponent } from './request-access-error-dialog.component';

describe('RequestAccessErrorDialogComponent', () => {
  let component: RequestAccessErrorDialogComponent;
  let fixture: ComponentFixture<RequestAccessErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestAccessErrorDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestAccessErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
