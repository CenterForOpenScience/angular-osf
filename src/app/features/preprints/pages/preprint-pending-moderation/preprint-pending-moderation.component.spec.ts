import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintPendingModerationComponent } from './preprint-pending-moderation.component';

describe('PreprintPendingModerationComponent', () => {
  let component: PreprintPendingModerationComponent;
  let fixture: ComponentFixture<PreprintPendingModerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintPendingModerationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintPendingModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
