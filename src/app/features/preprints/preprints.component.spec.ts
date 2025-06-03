import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintsComponent } from './preprints.component';

describe('PreprintsComponent', () => {
  let component: PreprintsComponent;
  let fixture: ComponentFixture<PreprintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
