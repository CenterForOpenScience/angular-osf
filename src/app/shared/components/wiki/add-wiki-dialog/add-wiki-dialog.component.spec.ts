import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWikiDialogComponent } from './add-wiki-dialog.component';

describe('AddWikiDialogComponent', () => {
  let component: AddWikiDialogComponent;
  let fixture: ComponentFixture<AddWikiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWikiDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddWikiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
