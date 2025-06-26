import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesTreeComponent } from './files-tree.component';

describe('FilesTreeComponent', () => {
  let component: FilesTreeComponent;
  let fixture: ComponentFixture<FilesTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilesTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
