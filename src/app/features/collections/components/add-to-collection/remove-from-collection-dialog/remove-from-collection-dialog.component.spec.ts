import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveFromCollectionDialogComponent } from './remove-from-collection-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('RemoveFromCollectionDialogComponent', () => {
  let component: RemoveFromCollectionDialogComponent;
  let fixture: ComponentFixture<RemoveFromCollectionDialogComponent>;
  let dialogRef: DynamicDialogRef;

  beforeEach(async () => {
    dialogRef = { close: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [RemoveFromCollectionDialogComponent, OSFTestingModule],
      providers: [
        { provide: DynamicDialogRef, useValue: dialogRef },
        {
          provide: DynamicDialogConfig,
          useValue: { data: { projectTitle: 'Project Alpha' } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveFromCollectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read project title from config', () => {
    expect(component.projectTitle).toBe('Project Alpha');
  });

  it('should close dialog with confirm result including comment', () => {
    component.comment.set('Reason text');
    component.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith({ confirmed: true, comment: 'Reason text' });
  });

  it('should close dialog with default comment when none provided', () => {
    component.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith({ confirmed: true, comment: '' });
  });

  it('should close dialog without value on cancel', () => {
    component.cancel();
    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});
