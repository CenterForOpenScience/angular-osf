import { MockProvider } from 'ng-mocks';

import { Clipboard } from '@angular/cdk/clipboard';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceOverview } from '@shared/models';
import { ToastService } from '@shared/services';
import { CitationsSelectors } from '@shared/stores';

import { ResourceCitationsComponent } from './resource-citations.component';

import { MOCK_RESOURCE_OVERVIEW } from '@testing/mocks';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('ResourceCitationsComponent', () => {
  let component: ResourceCitationsComponent;
  let fixture: ComponentFixture<ResourceCitationsComponent>;
  let mockClipboard: jest.Mocked<Clipboard>;
  let mockToastService: ReturnType<ToastServiceMockBuilder['build']>;

  const mockResource: ResourceOverview = MOCK_RESOURCE_OVERVIEW;

  beforeEach(async () => {
    mockClipboard = {
      copy: jest.fn(),
    } as any;
    mockToastService = ToastServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [ResourceCitationsComponent, OSFTestingModule],
      providers: [
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceCitationsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('currentResource', mockResource);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should have currentResource as required input', () => {
    fixture.componentRef.setInput('currentResource', mockResource);
    fixture.detectChanges();

    expect(component.currentResource()).toEqual(mockResource);
  });

  it('should have canEdit input with default value false', () => {
    fixture.componentRef.setInput('currentResource', mockResource);
    fixture.detectChanges();

    expect(component.canEdit()).toBe(false);
  });

  it('should prevent default event and not throw error', () => {
    const mockEvent = {
      originalEvent: { preventDefault: jest.fn() },
      filter: 'apa',
    } as any;

    fixture.componentRef.setInput('currentResource', mockResource);
    fixture.detectChanges();

    expect(() => component.handleCitationStyleFilterSearch(mockEvent)).not.toThrow();
    expect(mockEvent.originalEvent.preventDefault).toHaveBeenCalled();
  });

  it('should call action when resource exists', () => {
    const mockEvent = {
      value: { id: 'citation-style-id' },
    } as any;

    fixture.componentRef.setInput('currentResource', mockResource);
    fixture.detectChanges();

    expect(() => component.handleGetStyledCitation(mockEvent)).not.toThrow();
  });

  it('should not throw when resource is null', () => {
    const mockEvent = {
      value: { id: 'citation-style-id' },
    } as any;

    fixture.componentRef.setInput('currentResource', null);
    fixture.detectChanges();

    expect(() => component.handleGetStyledCitation(mockEvent)).not.toThrow();
  });

  it('should call handleUpdateCustomCitation without errors when citation is valid', () => {
    fixture.componentRef.setInput('currentResource', mockResource);
    component.customCitationInput.setValue('New custom citation');

    expect(() => component.handleUpdateCustomCitation()).not.toThrow();
  });

  it('should not emit when citation text is empty', () => {
    fixture.componentRef.setInput('currentResource', mockResource);
    component.customCitationInput.setValue('   ');

    const emitSpy = jest.spyOn(component.customCitation, 'emit');

    component.handleUpdateCustomCitation();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not throw when resource is null', () => {
    fixture.componentRef.setInput('currentResource', null);
    component.customCitationInput.setValue('Some citation');

    expect(() => component.handleUpdateCustomCitation()).not.toThrow();
  });

  it('should call handleDeleteCustomCitation without errors', () => {
    fixture.componentRef.setInput('currentResource', mockResource);

    expect(() => component.handleDeleteCustomCitation()).not.toThrow();
  });

  it('should not throw handleDeleteCustomCitation when resource is null', () => {
    fixture.componentRef.setInput('currentResource', null);

    expect(() => component.handleDeleteCustomCitation()).not.toThrow();
  });

  it('should toggle isEditMode from false to true', () => {
    fixture.componentRef.setInput('currentResource', mockResource);
    fixture.detectChanges();

    expect(component.isEditMode()).toBe(false);

    component.toggleEditMode();

    expect(component.isEditMode()).toBe(true);
  });

  it('should toggle isEditMode from true to false', () => {
    fixture.componentRef.setInput('currentResource', mockResource);
    fixture.detectChanges();

    component.isEditMode.set(true);

    component.toggleEditMode();

    expect(component.isEditMode()).toBe(false);
  });

  it('should call toggleEditMode without errors', () => {
    fixture.componentRef.setInput('currentResource', mockResource);
    fixture.detectChanges();

    expect(() => component.toggleEditMode()).not.toThrow();
  });

  it('should copy citation to clipboard when customCitation exists', () => {
    const resourceWithCitation = {
      ...mockResource,
      customCitation: 'Citation to copy',
    };

    fixture.componentRef.setInput('currentResource', resourceWithCitation);
    fixture.detectChanges();

    component.copyCitation();

    expect(mockClipboard.copy).toHaveBeenCalledWith('Citation to copy');
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('settings.developerApps.messages.copied');
  });

  it('should not copy when customCitation is empty', () => {
    const resourceWithoutCitation = {
      ...mockResource,
      customCitation: '',
    };

    fixture.componentRef.setInput('currentResource', resourceWithoutCitation);
    fixture.detectChanges();

    component.copyCitation();

    expect(mockClipboard.copy).not.toHaveBeenCalled();
    expect(mockToastService.showSuccess).not.toHaveBeenCalled();
  });

  it('should not throw when resource is null', () => {
    fixture.componentRef.setInput('currentResource', null);
    fixture.detectChanges();

    expect(() => component.copyCitation()).not.toThrow();
    expect(mockClipboard.copy).not.toHaveBeenCalled();
  });
});
