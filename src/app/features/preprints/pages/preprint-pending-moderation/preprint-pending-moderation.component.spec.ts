import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintPendingModerationComponent } from './preprint-pending-moderation.component';

import { provideOSFCore } from '@testing/osf.testing.provider';

describe('PreprintPendingModerationComponent', () => {
  let component: PreprintPendingModerationComponent;
  let fixture: ComponentFixture<PreprintPendingModerationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PreprintPendingModerationComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(PreprintPendingModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
