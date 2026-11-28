import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CustomItemMetadataRecord } from '@osf/features/metadata/models';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { MetadataResourceInformationComponent } from './metadata-resource-information.component';

describe('MetadataResourceInformationComponent', () => {
  let component: MetadataResourceInformationComponent;
  let fixture: ComponentFixture<MetadataResourceInformationComponent>;

  const mockCustomItemMetadata: CustomItemMetadataRecord = {
    language: 'eng',
    resourceTypeGeneral: 'Dataset',
    funders: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MetadataResourceInformationComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(MetadataResourceInformationComponent);
    fixture.componentRef.setInput('customItemMetadata', mockCustomItemMetadata);
    fixture.componentRef.setInput('readonly', false);
    fixture.componentRef.setInput('languageOnly', false);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.readonly()).toBe(false);
    expect(component.languageOnly()).toBe(false);
  });

  it('should set customItemMetadata input', () => {
    expect(component.customItemMetadata()).toEqual(mockCustomItemMetadata);
  });

  it('should set readonly input', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    expect(component.readonly()).toBe(true);
  });

  it('should disable edit button when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const editButton = fixture.debugElement.query(By.css('[data-test-edit-resource-information-button]'));

    expect(editButton.componentInstance.disabled).toBe(true);
  });

  it('should emit openEditResourceInformationDialog event', () => {
    const emitSpy = vi.spyOn(component.openEditResourceInformationDialog, 'emit');

    component.openEditResourceInformationDialog.emit();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit showResourceInfo event', () => {
    const emitSpy = vi.spyOn(component.showResourceInfo, 'emit');

    component.showResourceInfo.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
