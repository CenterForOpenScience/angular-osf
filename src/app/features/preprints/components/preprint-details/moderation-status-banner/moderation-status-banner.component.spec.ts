import { MockComponent, MockPipes } from 'ng-mocks';

import { DatePipe, TitleCasePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAction } from '@osf/features/moderation/models';
import { ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';
import { PreprintRequest } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { IconComponent } from '@shared/components';

import { ModerationStatusBannerComponent } from './moderation-status-banner.component';

import { MOCK_PROVIDER } from '@testing/mocks';
import { EnvironmentTokenMock } from '@testing/mocks/environment.token.mock';
import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_REQUEST_MOCK } from '@testing/mocks/preprint-request.mock';
import { REVIEW_ACTION_MOCK } from '@testing/mocks/review-action.mock';
import { TranslationServiceMock } from '@testing/mocks/translation.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('ModerationStatusBannerComponent', () => {
  let component: ModerationStatusBannerComponent;
  let fixture: ComponentFixture<ModerationStatusBannerComponent>;

  const mockPreprint = PREPRINT_MOCK;
  const mockProvider = MOCK_PROVIDER;
  const mockReviewAction: ReviewAction = REVIEW_ACTION_MOCK;
  const mockWithdrawalRequest: PreprintRequest = PREPRINT_REQUEST_MOCK;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ModerationStatusBannerComponent,
        OSFTestingModule,
        MockComponent(IconComponent),
        MockPipes(TitleCasePipe, DatePipe),
      ],
      providers: [
        TranslationServiceMock,
        EnvironmentTokenMock,
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

    fixture = TestBed.createComponent(ModerationStatusBannerComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('provider', mockProvider);
    fixture.componentRef.setInput('latestAction', mockReviewAction);
    fixture.componentRef.setInput('latestWithdrawalRequest', mockWithdrawalRequest);
    fixture.componentRef.setInput('isPendingWithdrawal', false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return preprint from store', () => {
    const preprint = component.preprint();
    expect(preprint).toBe(mockPreprint);
  });

  it('should compute noActions when latestAction is null', () => {
    fixture.componentRef.setInput('latestAction', null);
    const noActions = component.noActions();
    expect(noActions).toBe(true);
  });

  it('should compute noActions when latestAction exists', () => {
    const noActions = component.noActions();
    expect(noActions).toBe(false);
  });

  it('should compute documentType from provider', () => {
    const documentType = component.documentType();
    expect(documentType).toBeDefined();
    expect(documentType?.singular).toBeDefined();
  });

  it('should compute labelDate from preprint dateLastTransitioned', () => {
    const labelDate = component.labelDate();
    expect(labelDate).toBe(mockPreprint.dateLastTransitioned);
  });

  it('should compute status for pending preprint', () => {
    const status = component.status();
    expect(status).toBe('preprints.details.statusBanner.pending');
  });

  it('should compute status for accepted preprint', () => {
    const acceptedPreprint = { ...mockPreprint, reviewsState: ReviewsState.Accepted };
    jest.spyOn(component, 'preprint').mockReturnValue(acceptedPreprint);
    const status = component.status();
    expect(status).toBe('preprints.details.statusBanner.accepted');
  });

  it('should compute status for pending withdrawal', () => {
    fixture.componentRef.setInput('isPendingWithdrawal', true);
    const status = component.status();
    expect(status).toBe('preprints.details.statusBanner.pending');
  });

  it('should compute iconClass for pending preprint', () => {
    const iconClass = component.iconClass();
    expect(iconClass).toBe('hourglass');
  });

  it('should compute iconClass for accepted preprint', () => {
    const acceptedPreprint = { ...mockPreprint, reviewsState: ReviewsState.Accepted };
    jest.spyOn(component, 'preprint').mockReturnValue(acceptedPreprint);
    const iconClass = component.iconClass();
    expect(iconClass).toBe('check-circle');
  });

  it('should compute iconClass for pending withdrawal', () => {
    fixture.componentRef.setInput('isPendingWithdrawal', true);
    const iconClass = component.iconClass();
    expect(iconClass).toBe('hourglass');
  });

  it('should compute severity for pending preprint with post-moderation', () => {
    const postModerationProvider = { ...mockProvider, reviewsWorkflow: ProviderReviewsWorkflow.PostModeration };
    fixture.componentRef.setInput('provider', postModerationProvider);
    const severity = component.severity();
    expect(severity).toBe('secondary');
  });

  it('should compute severity for accepted preprint', () => {
    const acceptedPreprint = { ...mockPreprint, reviewsState: ReviewsState.Accepted };
    jest.spyOn(component, 'preprint').mockReturnValue(acceptedPreprint);
    const severity = component.severity();
    expect(severity).toBe('success');
  });

  it('should compute severity for pending withdrawal', () => {
    fixture.componentRef.setInput('isPendingWithdrawal', true);
    const severity = component.severity();
    expect(severity).toBe('warn');
  });

  it('should compute recentActivityLanguage for no actions', () => {
    fixture.componentRef.setInput('latestAction', null);
    const language = component.recentActivityLanguage();
    expect(language).toBe('preprints.details.moderationStatusBanner.recentActivity.automatic.pending');
  });

  it('should compute recentActivityLanguage with actions', () => {
    const language = component.recentActivityLanguage();
    expect(language).toBe('preprints.details.moderationStatusBanner.recentActivity.pending');
  });

  it('should compute requestActivityLanguage for pending withdrawal', () => {
    fixture.componentRef.setInput('isPendingWithdrawal', true);
    const language = component.requestActivityLanguage();
    expect(language).toBe('preprints.details.moderationStatusBanner.recentActivity.pendingWithdrawal');
  });

  it('should not compute requestActivityLanguage when not pending withdrawal', () => {
    const language = component.requestActivityLanguage();
    expect(language).toBeUndefined();
  });

  it('should compute actionCreatorName from latestAction', () => {
    const name = component.actionCreatorName();
    expect(name).toBe('Test User');
  });

  it('should compute actionCreatorId from latestAction', () => {
    const id = component.actionCreatorId();
    expect(id).toBe('user-1');
  });

  it('should compute actionCreatorLink with environment webUrl', () => {
    const link = component.actionCreatorLink();
    expect(link).toBe(`${EnvironmentTokenMock.useValue.webUrl}/user-1`);
  });

  it('should compute withdrawalRequesterName from latestWithdrawalRequest', () => {
    const name = component.withdrawalRequesterName();
    expect(name).toBe('John Doe');
  });

  it('should compute withdrawalRequesterId from latestWithdrawalRequest', () => {
    const id = component.withdrawalRequesterId();
    expect(id).toBe('user-123');
  });
});
