import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesControlComponent } from './files-control.component';

describe('FilesControlComponent', () => {
  let component: FilesControlComponent;
  let fixture: ComponentFixture<FilesControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesControlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilesControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
