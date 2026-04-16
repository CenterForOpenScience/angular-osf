import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from '@osf/shared/components/select/select.component';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { ProjectDetailSettingAccordionComponent } from './project-detail-setting-accordion.component';

describe('ProjectDetailSettingAccordionComponent', () => {
  let component: ProjectDetailSettingAccordionComponent;
  let fixture: ComponentFixture<ProjectDetailSettingAccordionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectDetailSettingAccordionComponent, MockComponent(SelectComponent)],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(ProjectDetailSettingAccordionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with expanded set to false', () => {
    expect(component.expanded()).toBe(false);
  });

  it('should toggle expanded state when toggle() is called', () => {
    expect(component.expanded()).toBe(false);

    component.toggle();
    expect(component.expanded()).toBe(true);

    component.toggle();
    expect(component.expanded()).toBe(false);
  });
});
