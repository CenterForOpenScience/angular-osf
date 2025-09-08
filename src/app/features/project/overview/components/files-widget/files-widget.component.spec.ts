import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesWidgetComponent } from './files-widget.component';

describe.skip('FilesWidgetComponent', () => {
  let component: FilesWidgetComponent;
  let fixture: ComponentFixture<FilesWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilesWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
