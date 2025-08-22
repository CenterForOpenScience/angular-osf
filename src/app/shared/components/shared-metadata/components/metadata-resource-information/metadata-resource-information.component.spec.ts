import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomItemMetadataRecord } from '@osf/features/metadata/models';
import { TranslateServiceMock } from '@shared/mocks';

import { MetadataResourceInformationComponent } from './metadata-resource-information.component';

describe('MetadataResourceInformationComponent', () => {
  let component: MetadataResourceInformationComponent;
  let fixture: ComponentFixture<MetadataResourceInformationComponent>;

  const mockCustomItemMetadata: CustomItemMetadataRecord = {
    language: 'eng',
    resourceTypeGeneral: 'dataset',
    funders: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetadataResourceInformationComponent],
      providers: [TranslateServiceMock],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataResourceInformationComponent);
    fixture.componentRef.setInput('customItemMetadata', mockCustomItemMetadata);
    fixture.componentRef.setInput('readonly', false);

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.readonly()).toBe(false);
  });

  it('should set customItemMetadata input', () => {
    fixture.componentRef.setInput('customItemMetadata', mockCustomItemMetadata);
    fixture.detectChanges();

    expect(component.customItemMetadata()).toEqual(mockCustomItemMetadata);
  });

  it('should set readonly input', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    expect(component.readonly()).toBe(true);
  });

  it('should emit openEditResourceInformationDialog event', () => {
    const emitSpy = jest.spyOn(component.openEditResourceInformationDialog, 'emit');

    component.openEditResourceInformationDialog.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
