import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftFileDetailComponent } from './draft-file-detail.component';

describe('DraftFileDetailComponent', () => {
  let component: DraftFileDetailComponent;
  let fixture: ComponentFixture<DraftFileDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftFileDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DraftFileDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
