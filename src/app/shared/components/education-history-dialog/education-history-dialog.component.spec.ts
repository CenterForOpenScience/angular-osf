import { MockComponent, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';

import { EducationHistoryComponent } from '../education-history/education-history.component';

import { EducationHistoryDialogComponent } from './education-history-dialog.component';

describe('EducationHistoryDialogComponent', () => {
  let component: EducationHistoryDialogComponent;
  let fixture: ComponentFixture<EducationHistoryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EducationHistoryDialogComponent, MockComponent(EducationHistoryComponent)],
      providers: [provideOSFCore(), provideDynamicDialogRefMock(), MockProvider(DynamicDialogConfig)],
    });

    fixture = TestBed.createComponent(EducationHistoryDialogComponent);
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
