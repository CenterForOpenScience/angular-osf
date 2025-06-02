import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:src/app/features/project/addons/addons.component.spec.ts
import { AddonsComponent } from './addons.component';

describe('AddonsComponent', () => {
  let component: AddonsComponent;
  let fixture: ComponentFixture<AddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddonsComponent);
========
import { MoveFileDialogComponent } from './move-file-dialog.component';

describe('MoveFileDialogComponent', () => {
  let component: MoveFileDialogComponent;
  let fixture: ComponentFixture<MoveFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveFileDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoveFileDialogComponent);
>>>>>>>> 0317809 (chore(files): api):src/app/features/project/files/components/move-file-dialog/move-file-dialog.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
