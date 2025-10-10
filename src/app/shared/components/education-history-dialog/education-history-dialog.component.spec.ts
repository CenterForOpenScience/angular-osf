import { MockProvider } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationHistoryDialogComponent } from './education-history-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('EducationHistoryDialogComponent', () => {
  let component: EducationHistoryDialogComponent;
  let fixture: ComponentFixture<EducationHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationHistoryDialogComponent, OSFTestingModule],
      providers: [MockProvider(DynamicDialogRef), MockProvider(DynamicDialogConfig)],
    }).compileComponents();

    fixture = TestBed.createComponent(EducationHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call close method successfully', () => {
    const dialogRef = TestBed.inject(DynamicDialogRef);
    jest.spyOn(dialogRef, 'close');
    component.close();
    expect(dialogRef.close).toHaveBeenCalledTimes(1);
  });
});
