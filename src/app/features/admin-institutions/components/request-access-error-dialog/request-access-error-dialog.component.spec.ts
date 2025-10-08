import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAccessErrorDialogComponent } from './request-access-error-dialog.component';

import { DynamicDialogRefMock } from '@testing/mocks/dynamic-dialog-ref.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('RequestAccessErrorDialogComponent', () => {
  let component: RequestAccessErrorDialogComponent;
  let fixture: ComponentFixture<RequestAccessErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestAccessErrorDialogComponent, OSFTestingModule],
      providers: [DynamicDialogRefMock],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestAccessErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
