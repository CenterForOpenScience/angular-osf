import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileRedirectComponent } from './file-redirect.component';

describe.skip('FileRedirectComponent', () => {
  let component: FileRedirectComponent;
  let fixture: ComponentFixture<FileRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileRedirectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
