import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteNodeLinkDialogComponent } from './delete-node-link-dialog.component';

describe('DeleteNodeLinkDialogComponent', () => {
  let component: DeleteNodeLinkDialogComponent;
  let fixture: ComponentFixture<DeleteNodeLinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteNodeLinkDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteNodeLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
