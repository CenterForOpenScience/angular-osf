import { MockProvider } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RegistrationReviewStates } from '@osf/shared/enums/registration-review-states.enum';
import { RevisionReviewStates } from '@osf/shared/enums/revision-review-states.enum';

import { RegistryRevisionsComponent } from './registry-revisions.component';

import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { createMockSchemaResponse } from '@testing/mocks/schema-response.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';

const MOCK_REGISTRY = MOCK_REGISTRATION_OVERVIEW_MODEL;
const MOCK_RESPONSES = [
  createMockSchemaResponse('response-1', RevisionReviewStates.Approved, false),
  createMockSchemaResponse('response-2', RevisionReviewStates.Approved, true),
];

function setup() {
  TestBed.configureTestingModule({
    imports: [RegistryRevisionsComponent],
    providers: [provideOSFCore(), MockProvider(ActivatedRoute, ActivatedRouteMockBuilder.create().build())],
  });

  const fixture = TestBed.createComponent(RegistryRevisionsComponent);
  fixture.componentRef.setInput('registry', MOCK_REGISTRY);
  fixture.componentRef.setInput('schemaResponses', MOCK_RESPONSES);
  fixture.componentRef.setInput('selectedRevisionIndex', 0);
  fixture.detectChanges();

  return { fixture, component: fixture.componentInstance };
}

describe('RegistryRevisionsComponent', () => {
  it('should create with default values', () => {
    const { component } = setup();

    expect(component).toBeTruthy();
    expect(component.isSubmitting()).toBe(false);
    expect(component.isModeration()).toBe(false);
    expect(component.canEdit()).toBe(false);
  });

  it('should compute registryInProgress from revisionState', () => {
    const { fixture, component } = setup();

    expect(component.registryInProgress()).toBe(false);

    fixture.componentRef.setInput('registry', {
      ...MOCK_REGISTRY,
      revisionState: RevisionReviewStates.RevisionInProgress,
    });
    fixture.detectChanges();
    expect(component.registryInProgress()).toBe(true);
  });

  it('should compute registryApproved from revisionState', () => {
    const { fixture, component } = setup();

    expect(component.registryApproved()).toBe(true);

    fixture.componentRef.setInput('registry', {
      ...MOCK_REGISTRY,
      revisionState: RevisionReviewStates.RevisionInProgress,
    });
    fixture.detectChanges();
    expect(component.registryApproved()).toBe(false);
  });

  it('should compute registryAcceptedUnapproved when both conditions met', () => {
    const { fixture, component } = setup();

    expect(component.registryAcceptedUnapproved()).toBe(false);

    fixture.componentRef.setInput('registry', {
      ...MOCK_REGISTRY,
      revisionState: RevisionReviewStates.Unapproved,
      reviewsState: RegistrationReviewStates.Accepted,
    });
    fixture.detectChanges();
    expect(component.registryAcceptedUnapproved()).toBe(true);
  });

  it('should compute unApprovedRevisionId when registryAcceptedUnapproved', () => {
    const { fixture, component } = setup();

    expect(component.unApprovedRevisionId()).toBeNull();

    fixture.componentRef.setInput('registry', {
      ...MOCK_REGISTRY,
      revisionState: RevisionReviewStates.Unapproved,
      reviewsState: RegistrationReviewStates.Accepted,
    });
    fixture.componentRef.setInput('schemaResponses', [
      createMockSchemaResponse('approved-1', RevisionReviewStates.Approved, false),
      createMockSchemaResponse('unapproved-1', RevisionReviewStates.Unapproved, false),
    ]);
    fixture.detectChanges();

    expect(component.unApprovedRevisionId()).toBe('unapproved-1');
  });

  it('should label single revision as original', () => {
    const { fixture, component } = setup();
    fixture.componentRef.setInput('schemaResponses', [
      createMockSchemaResponse('single', RevisionReviewStates.Approved, true),
    ]);
    fixture.detectChanges();

    expect(component.revisions()).toHaveLength(1);
    expect(component.revisions()[0].label).toBe('registry.overview.original');
  });

  it('should label first as latest and last as original for multiple revisions', () => {
    const { component } = setup();
    const revisions = component.revisions();

    expect(revisions[0].label).toBe('registry.overview.latest');
    expect(revisions[revisions.length - 1].label).toBe('registry.overview.original');
  });

  it('should mark correct revision as selected', () => {
    const { fixture, component } = setup();

    expect(component.revisions()[0].isSelected).toBe(true);
    expect(component.revisions()[1].isSelected).toBe(false);

    fixture.componentRef.setInput('selectedRevisionIndex', 1);
    fixture.detectChanges();

    expect(component.revisions()[0].isSelected).toBe(false);
    expect(component.revisions()[1].isSelected).toBe(true);
  });

  it('should show all revisions in moderation mode', () => {
    const { fixture, component } = setup();
    fixture.componentRef.setInput('schemaResponses', [
      createMockSchemaResponse('r-1', RevisionReviewStates.Approved, false),
      createMockSchemaResponse('r-2', RevisionReviewStates.Unapproved, false),
      createMockSchemaResponse('r-3', RevisionReviewStates.Approved, true),
    ]);
    fixture.componentRef.setInput('isModeration', true);
    fixture.detectChanges();

    expect(component.revisions()).toHaveLength(3);
  });

  it('should filter to approved or original when not in moderation', () => {
    const { fixture, component } = setup();
    fixture.componentRef.setInput('schemaResponses', [
      createMockSchemaResponse('r-1', RevisionReviewStates.Approved, false),
      createMockSchemaResponse('r-2', RevisionReviewStates.Unapproved, false),
      createMockSchemaResponse('r-3', RevisionReviewStates.Approved, true),
    ]);
    fixture.componentRef.setInput('isModeration', false);
    fixture.detectChanges();

    expect(component.revisions()).toHaveLength(2);
  });

  it('should emit openRevision on emitOpenRevision', () => {
    const { component } = setup();
    const spy = jest.fn();
    component.openRevision.subscribe(spy);

    component.emitOpenRevision(1);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should emit continueUpdate on continueUpdateHandler', () => {
    const { component } = setup();
    const spy = jest.fn();
    component.continueUpdate.subscribe(spy);

    component.continueUpdateHandler();

    expect(spy).toHaveBeenCalled();
  });
});
