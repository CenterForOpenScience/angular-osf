import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { PreprintPendingModerationComponent } from './preprint-pending-moderation.component';

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

  it('should render pending moderation title', () => {
    const title = fixture.nativeElement.querySelector('h2');

    expect(title).toBeTruthy();
    expect(title.textContent).toContain('preprints.details.moderationStatusBanner.pendingDetails.title');
  });

  it('should render pending moderation body', () => {
    const body = fixture.nativeElement.querySelector('p');

    expect(body).toBeTruthy();
    expect(body.textContent).toContain('preprints.details.moderationStatusBanner.pendingDetails.body');
  });
});
