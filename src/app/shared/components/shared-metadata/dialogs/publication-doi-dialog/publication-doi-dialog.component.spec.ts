import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationDoiDialogComponent } from './publication-doi-dialog.component';

describe.skip('PublicationDoiDialogComponent', () => {
  let component: PublicationDoiDialogComponent;
  let fixture: ComponentFixture<PublicationDoiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicationDoiDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicationDoiDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
