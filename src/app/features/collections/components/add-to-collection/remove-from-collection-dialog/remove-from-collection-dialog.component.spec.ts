import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveFromCollectionDialogComponent } from './remove-from-collection-dialog.component';

describe('RemoveFromCollectionDialogComponent', () => {
  let component: RemoveFromCollectionDialogComponent;
  let fixture: ComponentFixture<RemoveFromCollectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveFromCollectionDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveFromCollectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
