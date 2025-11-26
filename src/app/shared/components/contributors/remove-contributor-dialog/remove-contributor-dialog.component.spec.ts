import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveContributorDialogComponent } from './remove-contributor-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('RemoveContributorDialogComponent', () => {
  let component: RemoveContributorDialogComponent;
  let fixture: ComponentFixture<RemoveContributorDialogComponent>;
  let dialogRef: DynamicDialogRef;

  beforeEach(async () => {
    dialogRef = { close: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [RemoveContributorDialogComponent, OSFTestingModule],
      providers: [
        { provide: DynamicDialogRef, useValue: dialogRef },
        {
          provide: DynamicDialogConfig,
          useValue: { data: { name: 'John Doe', hasChildren: true } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveContributorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass name from config', () => {
    expect(component.name).toBe('John Doe');
  });

  it('should close dialog with selected option on confirm', () => {
    component.selectedOption = true;
    component.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog without value on cancel', () => {
    component.cancel();
    expect(dialogRef.close).toHaveBeenCalledWith();
  });
});
