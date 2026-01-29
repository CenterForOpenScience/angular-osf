import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintPendingModerationComponent } from './preprint-pending-moderation.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('PreprintPendingModerationComponent', () => {
  let component: PreprintPendingModerationComponent;
  let fixture: ComponentFixture<PreprintPendingModerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreprintPendingModerationComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintPendingModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
