import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TogglePublicityDialogComponent } from './toggle-publicity-dialog.component';

describe('TogglePublicityDialogComponent', () => {
  let component: TogglePublicityDialogComponent;
  let fixture: ComponentFixture<TogglePublicityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TogglePublicityDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TogglePublicityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
