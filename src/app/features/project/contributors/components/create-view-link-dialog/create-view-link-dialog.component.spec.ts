import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateViewLinkDialogComponent } from './create-view-link-dialog.component';

describe('CreateViewLinkDialogComponent', () => {
  let component: CreateViewLinkDialogComponent;
  let fixture: ComponentFixture<CreateViewLinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateViewLinkDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateViewLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
