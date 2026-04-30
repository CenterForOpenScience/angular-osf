import { MockProvider } from 'ng-mocks';

import { Mocked } from 'vitest';

import { Clipboard } from '@angular/cdk/clipboard';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { ToastService } from '@osf/shared/services/toast.service';
import { CitationsSelectors } from '@shared/stores/citations';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

import { ResourceCitationsComponent } from './resource-citations.component';

describe('ResourceCitationsComponent', () => {
  let component: ResourceCitationsComponent;
  let fixture: ComponentFixture<ResourceCitationsComponent>;
  let mockClipboard: Mocked<Clipboard>;
  let mockToastService: ReturnType<ToastServiceMockBuilder['build']>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;

  const mockResourceId = 'resource-123';
  const mockResourceType = CurrentResourceType.Projects;
  const mockCustomCitation = 'Custom citation text';

  beforeEach(() => {
    mockClipboard = { copy: vi.fn() } as any;
    mockToastService = ToastServiceMockBuilder.create().build();
    mockRouter = RouterMockBuilder.create().build();

    TestBed.configureTestingModule({
      imports: [ResourceCitationsComponent],
      providers: [
        provideOSFCore(),
        provideMockStore({
          signals: [
            { selector: CitationsSelectors.getDefaultCitations, value: signal([]) },
            { selector: CitationsSelectors.getDefaultCitationsLoading, value: signal(false) },
            { selector: CitationsSelectors.getCitationStyles, value: signal([]) },
            { selector: CitationsSelectors.getCitationStylesLoading, value: signal(false) },
            { selector: CitationsSelectors.getCustomCitationSubmitting, value: signal(false) },
            { selector: CitationsSelectors.getStyledCitation, value: signal(null) },
          ],
        }),
        MockProvider(Clipboard, mockClipboard),
        MockProvider(ToastService, mockToastService),
        MockProvider(Router, mockRouter),
      ],
    });

    fixture = TestBed.createComponent(ResourceCitationsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('resourceId', mockResourceId);
    fixture.componentRef.setInput('resourceType', mockResourceType);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should have canEdit input with default value false', () => {
    fixture.componentRef.setInput('resourceId', mockResourceId);
    fixture.componentRef.setInput('resourceType', mockResourceType);
    fixture.detectChanges();

    expect(component.canEdit()).toBe(false);
  });

  it('should have customCitations input', () => {
    fixture.componentRef.setInput('resourceId', mockResourceId);
    fixture.componentRef.setInput('resourceType', mockResourceType);
    fixture.componentRef.setInput('customCitations', mockCustomCitation);
    fixture.detectChanges();

    expect(component.customCitations()).toBe(mockCustomCitation);
  });

  it('should prevent default event and not throw error', () => {
    const mockEvent = {
      originalEvent: { preventDefault: vi.fn() },
      filter: 'apa',
    } as any;

    fixture.componentRef.setInput('resourceId', mockResourceId);
    fixture.componentRef.setInput('resourceType', mockResourceType);
    fixture.detectChanges();

    expect(() => component.handleCitationStyleFilterSearch(mockEvent)).not.toThrow();
    expect(mockEvent.originalEvent.preventDefault).toHaveBeenCalled();
  });

  it('should not throw when resourceId is empty', () => {
    const mockEvent = {
      value: { id: 'citation-style-id' },
    } as any;

    fixture.componentRef.setInput('resourceId', '');
    fixture.componentRef.setInput('resourceType', mockResourceType);
    fixture.detectChanges();

    expect(() => component.handleGetStyledCitation(mockEvent)).not.toThrow();
  });

  it('should not emit when citation text is empty', () => {
    fixture.componentRef.setInput('resourceId', mockResourceId);
    fixture.componentRef.setInput('resourceType', mockResourceType);
    component.customCitationInput.setValue('   ');

    const emitSpy = vi.spyOn(component.customCitationChange, 'emit');

    component.handleUpdateCustomCitation();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not throw handleDeleteCustomCitation when resourceId is empty', () => {
    fixture.componentRef.setInput('resourceId', '');
    fixture.componentRef.setInput('resourceType', mockResourceType);

    expect(() => component.handleDeleteCustomCitation()).not.toThrow();
  });

  it('should toggle isEditMode from false to true', () => {
    fixture.componentRef.setInput('resourceId', mockResourceId);
    fixture.componentRef.setInput('resourceType', mockResourceType);
    fixture.detectChanges();

    expect(component.isEditMode()).toBe(false);

    component.toggleEditMode();

    expect(component.isEditMode()).toBe(true);
  });

  it('should toggle isEditMode from true to false', () => {
    fixture.componentRef.setInput('resourceId', mockResourceId);
    fixture.componentRef.setInput('resourceType', mockResourceType);
    fixture.detectChanges();

    component.isEditMode.set(true);

    component.toggleEditMode();

    expect(component.isEditMode()).toBe(false);
  });

  it('should copy citation to clipboard when customCitations exists', () => {
    fixture.componentRef.setInput('resourceId', mockResourceId);
    fixture.componentRef.setInput('resourceType', mockResourceType);
    fixture.componentRef.setInput('customCitations', 'Citation to copy');
    fixture.detectChanges();

    component.copyCitation();

    expect(mockClipboard.copy).toHaveBeenCalledWith('Citation to copy');
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('common.labels.copied');
  });

  it('should not copy when customCitations is empty', () => {
    fixture.componentRef.setInput('resourceId', mockResourceId);
    fixture.componentRef.setInput('resourceType', mockResourceType);
    fixture.componentRef.setInput('customCitations', '');
    fixture.detectChanges();

    component.copyCitation();

    expect(mockClipboard.copy).not.toHaveBeenCalled();
    expect(mockToastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should not copy when customCitations is null', () => {
    fixture.componentRef.setInput('resourceId', mockResourceId);
    fixture.componentRef.setInput('resourceType', mockResourceType);
    fixture.componentRef.setInput('customCitations', null);
    fixture.detectChanges();

    component.copyCitation();

    expect(mockClipboard.copy).not.toHaveBeenCalled();
    expect(mockToastService.showSuccess).not.toHaveBeenCalled();
  });
});
