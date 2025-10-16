import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationReviewStates, RevisionReviewStates } from '@osf/shared/enums';

import { RegistryRevisionsComponent } from './registry-revisions.component';

import { MOCK_REGISTRY_OVERVIEW } from '@testing/mocks/registry-overview.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('RegistryRevisionsComponent', () => {
  let component: RegistryRevisionsComponent;
  let fixture: ComponentFixture<RegistryRevisionsComponent>;

  const mockRegistry = {
    ...MOCK_REGISTRY_OVERVIEW,
    schemaResponses: [
      {
        id: 'response-1',
        reviewsState: RevisionReviewStates.Approved,
        dateCreated: '2023-01-01T00:00:00Z',
        dateModified: '2023-01-01T00:00:00Z',
      },
      {
        id: 'response-2',
        reviewsState: RevisionReviewStates.Approved,
        dateCreated: '2023-01-02T00:00:00Z',
        dateModified: '2023-01-02T00:00:00Z',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryRevisionsComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryRevisionsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('registry', mockRegistry);
    fixture.componentRef.setInput('selectedRevisionIndex', 0);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isSubmitting()).toBe(false);
    expect(component.isModeration()).toBe(false);
    expect(component.canEdit()).toBe(false);
    expect(component.unApprovedRevisionId).toBe(null);
  });

  it('should receive required inputs', () => {
    expect(component.registry()).toEqual(mockRegistry);
    expect(component.selectedRevisionIndex()).toBe(0);
  });

  it('should compute revisions correctly', () => {
    const revisions = component.revisions();

    expect(revisions).toHaveLength(2);
    expect(revisions[0].index).toBe(0);
    expect(revisions[0].isSelected).toBe(true);
    expect(revisions[0].label).toBe('registry.overview.latest');
    expect(revisions[1].index).toBe(1);
    expect(revisions[1].isSelected).toBe(false);
    expect(revisions[1].label).toBe('registry.overview.original');
  });

  it('should compute revisions with single revision', () => {
    const singleRevisionRegistry = {
      ...mockRegistry,
      schemaResponses: [mockRegistry.schemaResponses![0]],
    };

    fixture.componentRef.setInput('registry', singleRevisionRegistry);
    fixture.detectChanges();

    const revisions = component.revisions();
    expect(revisions).toHaveLength(1);
    expect(revisions[0].label).toBe('registry.overview.original');
  });

  it('should filter revisions in moderation mode', () => {
    fixture.componentRef.setInput('isModeration', true);
    fixture.detectChanges();

    const revisions = component.revisions();
    expect(revisions).toHaveLength(2);
  });

  it('should filter revisions in non-moderation mode', () => {
    fixture.componentRef.setInput('isModeration', false);
    fixture.detectChanges();

    const revisions = component.revisions();
    expect(revisions).toHaveLength(2);
  });

  it('should compute registryInProgress correctly', () => {
    expect(component.registryInProgress).toBe(false);

    const inProgressRegistry = { ...mockRegistry, revisionStatus: RevisionReviewStates.RevisionInProgress };
    fixture.componentRef.setInput('registry', inProgressRegistry);
    fixture.detectChanges();

    expect(component.registryInProgress).toBe(true);
  });

  it('should compute registryApproved correctly', () => {
    expect(component.registryApproved).toBe(true);

    const notApprovedRegistry = { ...mockRegistry, revisionStatus: RevisionReviewStates.RevisionInProgress };
    fixture.componentRef.setInput('registry', notApprovedRegistry);
    fixture.detectChanges();

    expect(component.registryApproved).toBe(false);
  });

  it('should compute registryAcceptedUnapproved correctly', () => {
    expect(component.registryAcceptedUnapproved).toBe(false);

    const unapprovedRegistry = {
      ...mockRegistry,
      revisionStatus: RevisionReviewStates.Unapproved,
      reviewsState: RegistrationReviewStates.Accepted,
    };
    fixture.componentRef.setInput('registry', unapprovedRegistry);
    fixture.detectChanges();

    expect(component.registryAcceptedUnapproved).toBe(true);
  });

  it('should emit openRevision when emitOpenRevision is called', () => {
    const emitSpy = jest.fn();
    component.openRevision.subscribe(emitSpy);

    component.emitOpenRevision(1);

    expect(emitSpy).toHaveBeenCalledWith(1);
  });

  it('should emit continueUpdate when continueUpdateHandler is called', () => {
    const emitSpy = jest.fn();
    component.continueUpdate.subscribe(emitSpy);

    component.continueUpdateHandler();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should handle different input configurations', () => {
    fixture.componentRef.setInput('isSubmitting', true);
    fixture.componentRef.setInput('isModeration', true);
    fixture.componentRef.setInput('canEdit', true);
    fixture.componentRef.setInput('selectedRevisionIndex', 1);
    fixture.detectChanges();

    expect(component.isSubmitting()).toBe(true);
    expect(component.isModeration()).toBe(true);
    expect(component.canEdit()).toBe(true);
    expect(component.selectedRevisionIndex()).toBe(1);
  });

  it('should handle registry with different revision statuses', () => {
    const statuses = [
      RevisionReviewStates.Approved,
      RevisionReviewStates.RevisionInProgress,
      RevisionReviewStates.Unapproved,
    ];

    statuses.forEach((status) => {
      const registryWithStatus = { ...mockRegistry, revisionStatus: status };
      fixture.componentRef.setInput('registry', registryWithStatus);
      fixture.detectChanges();

      expect(component.registry()!.revisionStatus).toBe(status);
    });
  });

  it('should handle registry with different review states', () => {
    const reviewStates = [
      RegistrationReviewStates.Pending,
      RegistrationReviewStates.Accepted,
      RegistrationReviewStates.Rejected,
    ];

    reviewStates.forEach((reviewsState) => {
      const registryWithReviewState = { ...mockRegistry, reviewsState };
      fixture.componentRef.setInput('registry', registryWithReviewState);
      fixture.detectChanges();

      expect(component.registry()!.reviewsState).toBe(reviewsState);
    });
  });

  it('should handle registry with mixed schema response states', () => {
    const mixedRegistry = {
      ...mockRegistry,
      schemaResponses: [
        {
          id: 'response-1',
          reviewsState: RevisionReviewStates.Approved,
          created: '2023-01-01T00:00:00Z',
          modified: '2023-01-01T00:00:00Z',
        },
        {
          id: 'response-2',
          reviewsState: RevisionReviewStates.Unapproved,
          created: '2023-01-02T00:00:00Z',
          modified: '2023-01-02T00:00:00Z',
        },
      ],
    };

    fixture.componentRef.setInput('registry', mixedRegistry);
    fixture.detectChanges();

    const revisions = component.revisions();
    expect(revisions).toHaveLength(1);
  });

  it('should be reactive to input changes', () => {
    fixture.componentRef.setInput('selectedRevisionIndex', 1);
    fixture.detectChanges();

    const revisions = component.revisions();
    expect(revisions[0].isSelected).toBe(false);
    expect(revisions[1].isSelected).toBe(true);
  });
});
