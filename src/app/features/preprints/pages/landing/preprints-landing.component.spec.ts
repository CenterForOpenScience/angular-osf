import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintsLandingComponent } from './preprints-landing.component';

describe('OverviewComponent', () => {
  let component: PreprintsLandingComponent;
  let fixture: ComponentFixture<PreprintsLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintsLandingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
