import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileMenuComponent } from './file-menu.component';

describe('FileMenuComponent', () => {
  let component: FileMenuComponent;
  let fixture: ComponentFixture<FileMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
