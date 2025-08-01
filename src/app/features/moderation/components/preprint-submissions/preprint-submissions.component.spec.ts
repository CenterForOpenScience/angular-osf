import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintSubmissionsComponent } from './preprint-submissions.component';

describe('PreprintSubmissionsComponent', () => {
  let component: PreprintSubmissionsComponent;
  let fixture: ComponentFixture<PreprintSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintSubmissionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
