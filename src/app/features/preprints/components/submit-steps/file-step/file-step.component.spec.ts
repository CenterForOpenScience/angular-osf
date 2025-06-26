import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileStepComponent } from './file-step.component';

describe('FileStepComponent', () => {
  let component: FileStepComponent;
  let fixture: ComponentFixture<FileStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
