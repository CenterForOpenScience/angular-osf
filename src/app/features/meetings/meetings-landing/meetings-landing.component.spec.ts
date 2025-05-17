import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsLandingComponent } from './meetings-landing.component';

describe('MeetingsLandingComponent', () => {
  let component: MeetingsLandingComponent;
  let fixture: ComponentFixture<MeetingsLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingsLandingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingsLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
