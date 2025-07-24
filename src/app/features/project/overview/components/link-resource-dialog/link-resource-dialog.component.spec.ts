import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkResourceDialogComponent } from './link-resource-dialog.component';

describe('LinkProjectDialogComponent', () => {
  let component: LinkResourceDialogComponent;
  let fixture: ComponentFixture<LinkResourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkResourceDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
