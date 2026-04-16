import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';

import { EmploymentHistoryComponent } from '../employment-history/employment-history.component';

import { EmploymentHistoryDialogComponent } from './employment-history-dialog.component';

describe('EmploymentHistoryDialogComponent', () => {
  let component: EmploymentHistoryDialogComponent;
  let fixture: ComponentFixture<EmploymentHistoryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmploymentHistoryDialogComponent, MockComponent(EmploymentHistoryComponent)],
      providers: [provideOSFCore(), provideDynamicDialogRefMock(), MockProvider(DynamicDialogConfig)],
    });

    fixture = TestBed.createComponent(EmploymentHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call close method successfully', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    component.close();
    expect(dialogRef.close).toHaveBeenCalledTimes(1);
  });
});
