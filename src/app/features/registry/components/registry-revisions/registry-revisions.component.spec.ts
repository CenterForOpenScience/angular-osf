import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';
import { SchemaResponse } from '@osf/shared/models/registration/schema-response.model';

import { RegistryRevisionsComponent } from './registry-revisions.component';

import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { createMockSchemaResponse } from '@testing/mocks/schema-response.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('RegistryRevisionsComponent', () => {
  let component: RegistryRevisionsComponent;
  let fixture: ComponentFixture<RegistryRevisionsComponent>;

  const mockRegistry = MOCK_REGISTRATION_OVERVIEW_MODEL;

  const mockSchemaResponses: SchemaResponse[] = [
    createMockSchemaResponse('response-1', RevisionReviewStates.Approved, false),
    createMockSchemaResponse('response-2', RevisionReviewStates.Approved, true),
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryRevisionsComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryRevisionsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('registry', mockRegistry);
    fixture.componentRef.setInput('schemaResponses', mockSchemaResponses);
    fixture.componentRef.setInput('selectedRevisionIndex', 0);
    fixture.detectChanges();
  });

  it('should initialize with default input values', () => {
    expect(component.isSubmitting()).toBe(false);
    expect(component.isModeration()).toBe(false);
    expect(component.canEdit()).toBe(false);
    expect(component.unApprovedRevisionId).toBe(null);
  });

  it('should expose RevisionReviewStates enum', () => {
    expect(component.RevisionReviewStates).toBe(RevisionReviewStates);
  });

  it('should receive required inputs', () => {
    expect(component.registry()).toEqual(mockRegistry);
    expect(component.schemaResponses()).toEqual(mockSchemaResponses);
    expect(component.selectedRevisionIndex()).toBe(0);
  });

  it('should update when registry input changes', () => {
    const newRegistry = { ...mockRegistry, id: 'new-registry-id' };
    fixture.componentRef.setInput('registry', newRegistry);
    fixture.detectChanges();

    expect(component.registry()).toEqual(newRegistry);
  });

  it('should update when schemaResponses input changes', () => {
    const newResponses = [createMockSchemaResponse('new-response', RevisionReviewStates.Approved)];
    fixture.componentRef.setInput('schemaResponses', newResponses);
    fixture.detectChanges();

    expect(component.schemaResponses()).toEqual(newResponses);
  });

  it('should update when selectedRevisionIndex input changes', () => {
    fixture.componentRef.setInput('selectedRevisionIndex', 1);
    fixture.detectChanges();

    expect(component.selectedRevisionIndex()).toBe(1);
  });

  it('should update isSubmitting input', () => {
    fixture.componentRef.setInput('isSubmitting', true);
    fixture.detectChanges();

    expect(component.isSubmitting()).toBe(true);
  });

  it('should update isModeration input', () => {
    fixture.componentRef.setInput('isModeration', true);
    fixture.detectChanges();

    expect(component.isModeration()).toBe(true);
  });

  it('should update canEdit input', () => {
    fixture.componentRef.setInput('canEdit', true);
    fixture.detectChanges();

    expect(component.canEdit()).toBe(true);
  });

  describe('registryInProgress', () => {
    it('should return false when revisionState is not RevisionInProgress', () => {
      expect(component.registryInProgress).toBe(false);
    });

    it('should return true when revisionState is RevisionInProgress', () => {
      const inProgressRegistry = { ...mockRegistry, revisionState: RevisionReviewStates.RevisionInProgress };
      fixture.componentRef.setInput('registry', inProgressRegistry);
      fixture.detectChanges();

      expect(component.registryInProgress).toBe(true);
    });

    it('should return false when registry is null', () => {
      fixture.componentRef.setInput('registry', null);
      fixture.detectChanges();

      expect(component.registryInProgress).toBe(false);
    });
  });

  describe('registryApproved', () => {
    it('should return true when revisionState is Approved', () => {
      expect(component.registryApproved).toBe(true);
    });

    it('should return false when revisionState is not Approved', () => {
      const notApprovedRegistry = { ...mockRegistry, revisionState: RevisionReviewStates.RevisionInProgress };
      fixture.componentRef.setInput('registry', notApprovedRegistry);
      fixture.detectChanges();

      expect(component.registryApproved).toBe(false);
    });

    it('should return false when registry is null', () => {
      fixture.componentRef.setInput('registry', null);
      fixture.detectChanges();

      expect(component.registryApproved).toBe(false);
    });
  });

  describe('registryAcceptedUnapproved', () => {
    it('should return false when conditions are not met', () => {
      expect(component.registryAcceptedUnapproved).toBe(false);
    });

    it('should return true when revisionState is Unapproved and reviewsState is Accepted', () => {
      const unapprovedRegistry = {
        ...mockRegistry,
        revisionState: RevisionReviewStates.Unapproved,
        reviewsState: RegistrationReviewStates.Accepted,
      };
      fixture.componentRef.setInput('registry', unapprovedRegistry);
      fixture.detectChanges();

      expect(component.registryAcceptedUnapproved).toBe(true);
    });

    it('should return false when revisionState is Unapproved but reviewsState is not Accepted', () => {
      const unapprovedRegistry = {
        ...mockRegistry,
        revisionState: RevisionReviewStates.Unapproved,
        reviewsState: RegistrationReviewStates.Pending,
      };
      fixture.componentRef.setInput('registry', unapprovedRegistry);
      fixture.detectChanges();

      expect(component.registryAcceptedUnapproved).toBe(false);
    });

    it('should return false when reviewsState is Accepted but revisionState is not Unapproved', () => {
      const approvedRegistry = {
        ...mockRegistry,
        revisionState: RevisionReviewStates.Approved,
        reviewsState: RegistrationReviewStates.Accepted,
      };
      fixture.componentRef.setInput('registry', approvedRegistry);
      fixture.detectChanges();

      expect(component.registryAcceptedUnapproved).toBe(false);
    });

    it('should return false when registry is null', () => {
      fixture.componentRef.setInput('registry', null);
      fixture.detectChanges();

      expect(component.registryAcceptedUnapproved).toBe(false);
    });
  });

  describe('revisions computed signal', () => {
    it('should return empty array when schemaResponses is empty', () => {
      fixture.componentRef.setInput('schemaResponses', []);
      fixture.detectChanges();

      expect(component.revisions()).toHaveLength(0);
    });

    it('should handle null schemaResponses', () => {
      fixture.componentRef.setInput('schemaResponses', null as any);
      fixture.detectChanges();

      expect(component.revisions()).toHaveLength(0);
    });

    it('should assign "original" label when there is only one revision', () => {
      const singleResponse = [createMockSchemaResponse('single', RevisionReviewStates.Approved, true)];
      fixture.componentRef.setInput('schemaResponses', singleResponse);
      fixture.detectChanges();

      const revisions = component.revisions();
      expect(revisions).toHaveLength(1);
      expect(revisions[0].label).toBe('registry.overview.original');
    });

    it('should assign "latest" label to first revision when multiple revisions exist', () => {
      const revisions = component.revisions();
      expect(revisions[0].label).toBe('registry.overview.latest');
    });

    it('should assign "original" label to last revision when multiple revisions exist', () => {
      const revisions = component.revisions();
      const lastIndex = revisions.length - 1;
      expect(revisions[lastIndex].label).toBe('registry.overview.original');
    });

    it('should mark revision as selected when index matches selectedRevisionIndex', () => {
      fixture.componentRef.setInput('selectedRevisionIndex', 0);
      fixture.detectChanges();

      const revisions = component.revisions();
      expect(revisions[0].isSelected).toBe(true);
      expect(revisions[1].isSelected).toBe(false);
    });

    it('should update isSelected when selectedRevisionIndex changes', () => {
      fixture.componentRef.setInput('selectedRevisionIndex', 1);
      fixture.detectChanges();

      const revisions = component.revisions();
      expect(revisions[0].isSelected).toBe(false);
      expect(revisions[1].isSelected).toBe(true);
    });

    it('should show all revisions when isModeration is true', () => {
      const responsesWithUnapproved = [
        createMockSchemaResponse('response-1', RevisionReviewStates.Approved, false),
        createMockSchemaResponse('response-2', RevisionReviewStates.Unapproved, false),
        createMockSchemaResponse('response-3', RevisionReviewStates.Approved, true),
      ];
      fixture.componentRef.setInput('schemaResponses', responsesWithUnapproved);
      fixture.componentRef.setInput('isModeration', true);
      fixture.detectChanges();

      const revisions = component.revisions();
      expect(revisions).toHaveLength(3);
    });

    it('should filter to only Approved or isOriginalResponse when isModeration is false', () => {
      const responsesWithUnapproved = [
        createMockSchemaResponse('response-1', RevisionReviewStates.Approved, false),
        createMockSchemaResponse('response-2', RevisionReviewStates.Unapproved, false),
        createMockSchemaResponse('response-3', RevisionReviewStates.Approved, true),
      ];
      fixture.componentRef.setInput('schemaResponses', responsesWithUnapproved);
      fixture.componentRef.setInput('isModeration', false);
      fixture.detectChanges();

      const revisions = component.revisions();
      expect(revisions).toHaveLength(2);
      expect(revisions.every((r) => r.reviewsState === RevisionReviewStates.Approved || r.isOriginalResponse)).toBe(
        true
      );
    });

    it('should include original response even if not approved when isModeration is false', () => {
      const responsesWithUnapprovedOriginal = [
        createMockSchemaResponse('response-1', RevisionReviewStates.Approved, false),
        createMockSchemaResponse('response-2', RevisionReviewStates.Unapproved, true),
      ];
      fixture.componentRef.setInput('schemaResponses', responsesWithUnapprovedOriginal);
      fixture.componentRef.setInput('isModeration', false);
      fixture.detectChanges();

      const revisions = component.revisions();
      expect(revisions).toHaveLength(2);
      expect(revisions.some((r) => r.isOriginalResponse)).toBe(true);
    });

    it('should set unApprovedRevisionId when registryAcceptedUnapproved is true', () => {
      const unapprovedResponse = createMockSchemaResponse('unapproved-id', RevisionReviewStates.Unapproved, false);
      const responses = [
        createMockSchemaResponse('response-1', RevisionReviewStates.Approved, false),
        unapprovedResponse,
      ];
      const unapprovedRegistry = {
        ...mockRegistry,
        revisionState: RevisionReviewStates.Unapproved,
        reviewsState: RegistrationReviewStates.Accepted,
      };

      fixture.componentRef.setInput('registry', unapprovedRegistry);
      fixture.componentRef.setInput('schemaResponses', responses);
      fixture.detectChanges();

      expect(component.unApprovedRevisionId).toBe('unapproved-id');
    });

    it('should set unApprovedRevisionId to null when no unapproved revision found', () => {
      const responses = [
        createMockSchemaResponse('response-1', RevisionReviewStates.Approved, false),
        createMockSchemaResponse('response-2', RevisionReviewStates.Approved, true),
      ];
      const unapprovedRegistry = {
        ...mockRegistry,
        revisionState: RevisionReviewStates.Unapproved,
        reviewsState: RegistrationReviewStates.Accepted,
      };

      fixture.componentRef.setInput('registry', unapprovedRegistry);
      fixture.componentRef.setInput('schemaResponses', responses);
      fixture.detectChanges();

      expect(component.unApprovedRevisionId).toBe(null);
    });

    it('should not set unApprovedRevisionId when registryAcceptedUnapproved is false', () => {
      const unapprovedResponse = createMockSchemaResponse('unapproved-id', RevisionReviewStates.Unapproved, false);
      const responses = [
        createMockSchemaResponse('response-1', RevisionReviewStates.Approved, false),
        unapprovedResponse,
      ];

      fixture.componentRef.setInput('schemaResponses', responses);
      fixture.detectChanges();

      expect(component.unApprovedRevisionId).toBe(null);
    });

    it('should assign correct indices to revisions', () => {
      const revisions = component.revisions();
      revisions.forEach((revision, expectedIndex) => {
        expect(revision.index).toBe(expectedIndex);
      });
    });

    it('should preserve all response properties in revisions', () => {
      const revisions = component.revisions();
      expect(revisions[0].id).toBe(mockSchemaResponses[0].id);
      expect(revisions[0].dateCreated).toBe(mockSchemaResponses[0].dateCreated);
      expect(revisions[0].reviewsState).toBe(mockSchemaResponses[0].reviewsState);
    });
  });
});
