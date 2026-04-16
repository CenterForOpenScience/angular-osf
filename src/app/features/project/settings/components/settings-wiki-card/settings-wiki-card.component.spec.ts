import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { ProjectDetailSettingAccordionComponent } from '../project-detail-setting-accordion/project-detail-setting-accordion.component';

import { SettingsWikiCardComponent } from './settings-wiki-card.component';

describe('SettingsWikiCardComponent', () => {
  let component: SettingsWikiCardComponent;
  let fixture: ComponentFixture<SettingsWikiCardComponent>;

  const mockTitle = 'Wiki Settings';
  const mockWikiEnabled = true;
  const mockAnyoneCanEditWiki = false;
  const mockIsPublic = true;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SettingsWikiCardComponent, MockComponent(ProjectDetailSettingAccordionComponent)],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(SettingsWikiCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('wikiEnabled', mockWikiEnabled);
    fixture.componentRef.setInput('anyoneCanEditWiki', mockAnyoneCanEditWiki);
    fixture.componentRef.setInput('title', mockTitle);
    fixture.componentRef.setInput('isPublic', mockIsPublic);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with required inputs', () => {
    fixture.componentRef.setInput('wikiEnabled', mockWikiEnabled);
    fixture.componentRef.setInput('anyoneCanEditWiki', mockAnyoneCanEditWiki);
    fixture.componentRef.setInput('title', mockTitle);
    fixture.componentRef.setInput('isPublic', mockIsPublic);
    fixture.detectChanges();

    expect(component.wikiEnabled()).toBe(mockWikiEnabled);
    expect(component.anyoneCanEditWiki()).toBe(mockAnyoneCanEditWiki);
    expect(component.title()).toBe(mockTitle);
    expect(component.isPublic()).toBe(mockIsPublic);
  });

  it('should initialize with isPublic defaulting to false', () => {
    fixture.componentRef.setInput('wikiEnabled', mockWikiEnabled);
    fixture.componentRef.setInput('anyoneCanEditWiki', mockAnyoneCanEditWiki);
    fixture.componentRef.setInput('title', mockTitle);
    fixture.detectChanges();

    expect(component.isPublic()).toBe(false);
  });

  it('should emit wikiChangeEmit when wiki checkbox changes', () => {
    vi.spyOn(component.wikiChangeEmit, 'emit');
    fixture.componentRef.setInput('wikiEnabled', mockWikiEnabled);
    fixture.componentRef.setInput('anyoneCanEditWiki', mockAnyoneCanEditWiki);
    fixture.componentRef.setInput('title', mockTitle);
    fixture.detectChanges();

    component.wikiChangeEmit.emit(mockWikiEnabled);

    expect(component.wikiChangeEmit.emit).toHaveBeenCalledWith(mockWikiEnabled);
  });

  it('should emit anyoneCanEditWikiEmitValue when changeEmittedValue is called with boolean', () => {
    vi.spyOn(component.anyoneCanEditWikiEmitValue, 'emit');
    fixture.componentRef.setInput('wikiEnabled', mockWikiEnabled);
    fixture.componentRef.setInput('anyoneCanEditWiki', mockAnyoneCanEditWiki);
    fixture.componentRef.setInput('title', mockTitle);
    fixture.detectChanges();

    const emittedValue = { index: 0, value: true };
    component.changeEmittedValue(emittedValue);

    expect(component.anyoneCanEditWikiEmitValue.emit).toHaveBeenCalledWith(true);
  });

  it('should not emit anyoneCanEditWikiEmitValue when changeEmittedValue is called with string', () => {
    vi.spyOn(component.anyoneCanEditWikiEmitValue, 'emit');
    fixture.componentRef.setInput('wikiEnabled', mockWikiEnabled);
    fixture.componentRef.setInput('anyoneCanEditWiki', mockAnyoneCanEditWiki);
    fixture.componentRef.setInput('title', mockTitle);
    fixture.detectChanges();

    const emittedValue = { index: 0, value: 'string value' };
    component.changeEmittedValue(emittedValue);

    expect(component.anyoneCanEditWikiEmitValue.emit).not.toHaveBeenCalled();
  });

  it('should initialize allAccordionData with correct structure', () => {
    fixture.componentRef.setInput('wikiEnabled', mockWikiEnabled);
    fixture.componentRef.setInput('anyoneCanEditWiki', mockAnyoneCanEditWiki);
    fixture.componentRef.setInput('title', mockTitle);
    fixture.detectChanges();

    expect(component.allAccordionData).toHaveLength(1);
    expect(component.allAccordionData[0].label).toBe('myProjects.settings.whoCanEdit');
    expect(component.allAccordionData[0].value).toBe(mockAnyoneCanEditWiki);
    expect(component.allAccordionData[0].type).toBe('dropdown');
    expect(component.allAccordionData[0].options).toHaveLength(2);
  });

  it('should update allAccordionData when anyoneCanEditWiki input changes', () => {
    fixture.componentRef.setInput('wikiEnabled', mockWikiEnabled);
    fixture.componentRef.setInput('anyoneCanEditWiki', false);
    fixture.componentRef.setInput('title', mockTitle);
    fixture.detectChanges();

    expect(component.allAccordionData[0].value).toBe(false);

    fixture.componentRef.setInput('anyoneCanEditWiki', true);
    fixture.detectChanges();

    expect(component.allAccordionData[0].value).toBe(true);
  });
});
