import { MockComponents } from 'ng-mocks';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CedarTemplateFormComponent } from '@osf/features/metadata/components';
import { CedarMetadataDataTemplateJsonApi, CedarRecordDataBinding } from '@osf/features/metadata/models';
import { MetadataResourceEnum } from '@osf/shared/enums/metadata-resource.enum';
import { MetadataTabsModel } from '@shared/models/metadata-tabs.model';

import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

import { MetadataTabsComponent } from './metadata-tabs.component';

import { CEDAR_METADATA_DATA_TEMPLATE_JSON_API_MOCK } from '@testing/mocks/cedar-metadata-data-template-json-api.mock';
import { MOCK_CEDAR_METADATA_RECORD_DATA } from '@testing/mocks/cedar-metadata-record.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('MetadataTabsComponent', () => {
  let component: MetadataTabsComponent;
  let fixture: ComponentFixture<MetadataTabsComponent>;

  const mockTabs: MetadataTabsModel[] = [
    { id: 'tab1', label: 'Tab 1', type: MetadataResourceEnum.PROJECT },
    { id: 'tab2', label: 'Tab 2', type: MetadataResourceEnum.CEDAR },
    { id: 'tab3', label: 'Tab 3', type: MetadataResourceEnum.REGISTRY },
  ];

  const mockCedarTemplate: CedarMetadataDataTemplateJsonApi = CEDAR_METADATA_DATA_TEMPLATE_JSON_API_MOCK;

  const mockCedarRecord = MOCK_CEDAR_METADATA_RECORD_DATA;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MetadataTabsComponent,
        OSFTestingModule,
        ...MockComponents(LoadingSpinnerComponent, CedarTemplateFormComponent),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MetadataTabsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('tabs', mockTabs);
    fixture.componentRef.setInput('selectedTab', 'tab1');
    fixture.componentRef.setInput('selectedCedarTemplate', mockCedarTemplate);
    fixture.componentRef.setInput('selectedCedarRecord', mockCedarRecord);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.loading()).toBe(false);
    expect(component.cedarFormReadonly()).toBe(true);
    expect(component.canEdit()).toBe(true);
  });

  it('should accept loading input', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    expect(component.loading()).toBe(true);
  });

  it('should accept tabs input', () => {
    expect(component.tabs()).toEqual(mockTabs);
  });

  it('should accept selectedTab input', () => {
    expect(component.selectedTab()).toBe('tab1');
  });

  it('should accept selectedCedarTemplate input', () => {
    expect(component.selectedCedarTemplate()).toEqual(mockCedarTemplate);
  });

  it('should accept selectedCedarRecord input', () => {
    expect(component.selectedCedarRecord()).toEqual(mockCedarRecord);
  });

  it('should accept cedarFormReadonly input', () => {
    fixture.componentRef.setInput('cedarFormReadonly', false);
    fixture.detectChanges();

    expect(component.cedarFormReadonly()).toBe(false);
  });

  it('should accept canEdit input', () => {
    fixture.componentRef.setInput('canEdit', false);
    fixture.detectChanges();

    expect(component.canEdit()).toBe(false);
  });

  it('should emit changeTab event', () => {
    const spy = jest.fn();
    component.changeTab.subscribe(spy);

    component.changeTab.emit('tab2');

    expect(spy).toHaveBeenCalledWith('tab2');
  });

  it('should emit formSubmit on cedar form submit', () => {
    const spy = jest.fn();
    component.formSubmit.subscribe(spy);
    const mockData: CedarRecordDataBinding = { data: {} } as any;

    component.onCedarFormSubmit(mockData);

    expect(spy).toHaveBeenCalledWith(mockData);
  });

  it('should emit toggleFormEdit when toggleEditMode is called', () => {
    const spy = jest.fn();
    component.toggleFormEdit.subscribe(spy);

    component.toggleEditMode();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit cedarFormChangeTemplate when onCedarFormChangeTemplate is called', () => {
    const spy = jest.fn();
    component.cedarFormChangeTemplate.subscribe(spy);

    component.onCedarFormChangeTemplate();

    expect(spy).toHaveBeenCalled();
  });

  it('should handle null selectedCedarRecord', () => {
    fixture.componentRef.setInput('selectedCedarRecord', null);
    fixture.detectChanges();

    expect(component.selectedCedarRecord()).toBeNull();
  });

  it('should handle multiple tabs', () => {
    const manyTabs: MetadataTabsModel[] = [
      { id: 'tab1', label: 'Tab 1', type: MetadataResourceEnum.PROJECT },
      { id: 'tab2', label: 'Tab 2', type: MetadataResourceEnum.CEDAR },
      { id: 'tab3', label: 'Tab 3', type: MetadataResourceEnum.REGISTRY },
      { id: 'tab4', label: 'Tab 4', type: MetadataResourceEnum.PROJECT },
      { id: 'tab5', label: 'Tab 5', type: MetadataResourceEnum.CEDAR },
    ];
    fixture.componentRef.setInput('tabs', manyTabs);
    fixture.detectChanges();

    expect(component.tabs().length).toBe(5);
  });

  it('should handle tab change with string value', () => {
    const spy = jest.fn();
    component.changeTab.subscribe(spy);

    component.changeTab.emit('tab3');

    expect(spy).toHaveBeenCalledWith('tab3');
  });

  it('should handle tab change with number value', () => {
    const spy = jest.fn();
    component.changeTab.subscribe(spy);

    component.changeTab.emit(2);

    expect(spy).toHaveBeenCalledWith(2);
  });

  it('should accept all inputs together', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('tabs', mockTabs);
    fixture.componentRef.setInput('selectedTab', 'tab2');
    fixture.componentRef.setInput('selectedCedarTemplate', mockCedarTemplate);
    fixture.componentRef.setInput('selectedCedarRecord', null);
    fixture.componentRef.setInput('cedarFormReadonly', false);
    fixture.componentRef.setInput('canEdit', false);
    fixture.detectChanges();

    expect(component.loading()).toBe(true);
    expect(component.tabs()).toEqual(mockTabs);
    expect(component.selectedTab()).toBe('tab2');
    expect(component.selectedCedarTemplate()).toEqual(mockCedarTemplate);
    expect(component.selectedCedarRecord()).toBeNull();
    expect(component.cedarFormReadonly()).toBe(false);
    expect(component.canEdit()).toBe(false);
  });
});
