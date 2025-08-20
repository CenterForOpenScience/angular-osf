import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileLinkComponent } from './file-link.component';

describe('FileLinkComponent', () => {
  let component: FileLinkComponent;
  let fixture: ComponentFixture<FileLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
