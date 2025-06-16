import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionsListComponent } from './submissions-list.component';

describe('SubmissionsListComponent', () => {
  let component: SubmissionsListComponent;
  let fixture: ComponentFixture<SubmissionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmissionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
