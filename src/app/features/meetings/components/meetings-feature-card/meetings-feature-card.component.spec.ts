import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsFeatureCardComponent } from './meetings-feature-card.component';

describe('MeetingsFeatureCardComponent', () => {
  let component: MeetingsFeatureCardComponent;
  let fixture: ComponentFixture<MeetingsFeatureCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingsFeatureCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingsFeatureCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
