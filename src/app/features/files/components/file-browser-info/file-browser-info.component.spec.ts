import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileBrowserInfoComponent } from './file-browser-info.component';

describe('FileBrowserInfoComponent', () => {
  let component: FileBrowserInfoComponent;
  let fixture: ComponentFixture<FileBrowserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileBrowserInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileBrowserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
