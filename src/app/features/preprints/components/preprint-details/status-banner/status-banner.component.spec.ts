import { MockComponent, MockPipe } from 'ng-mocks';

import { TitleCasePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAction } from '@osf/features/moderation/models';
import { Preprint, PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { IconComponent } from '@shared/components';

import { StatusBannerComponent } from './status-banner.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { REVIEW_ACTION_MOCK } from '@testing/mocks/review-action.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('StatusBannerComponent', () => {
  let component: StatusBannerComponent;
  let fixture: ComponentFixture<StatusBannerComponent>;

  const mockPreprint: Preprint = PREPRINT_MOCK;
  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockReviewAction: ReviewAction = REVIEW_ACTION_MOCK;
  const mockRequestAction = REVIEW_ACTION_MOCK;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBannerComponent, OSFTestingModule, MockComponent(IconComponent), MockPipe(TitleCasePipe)],
      providers: [
        provideMockStore({
          signals: [
            {
              selector: PreprintSelectors.getPreprint,
              value: mockPreprint,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBannerComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('provider', mockProvider);
    fixture.componentRef.setInput('latestAction', mockReviewAction);
    fixture.componentRef.setInput('isPendingWithdrawal', false);
    fixture.componentRef.setInput('isWithdrawalRejected', false);
    fixture.componentRef.setInput('latestRequestAction', mockRequestAction);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute severity for pending preprint', () => {
    const severity = component.severity();
    expect(severity).toBe('warn');
  });

  it('should compute severity for pending withdrawal', () => {
    fixture.componentRef.setInput('isPendingWithdrawal', true);
    const severity = component.severity();
    expect(severity).toBe('error');
  });

  it('should compute status for pending preprint', () => {
    const status = component.status();
    expect(status).toBe('preprints.details.statusBanner.pending');
  });

  it('should compute status for pending withdrawal', () => {
    fixture.componentRef.setInput('isPendingWithdrawal', true);
    const status = component.status();
    expect(status).toBe('preprints.details.statusBanner.pendingWithdrawal');
  });

  it('should compute reviewer name from latest action', () => {
    const name = component.reviewerName();
    expect(name).toBe('Test User');
  });

  it('should compute reviewer comment from latest action', () => {
    const comment = component.reviewerComment();
    expect(comment).toBe('Initial comment');
  });

  it('should show feedback dialog', () => {
    expect(component.feedbackDialogVisible).toBe(false);
    component.showFeedbackDialog();
    expect(component.feedbackDialogVisible).toBe(true);
  });
});
