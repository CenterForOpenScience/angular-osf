import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from '@shared/components';

import { ProjectDetailSettingAccordionComponent } from './project-detail-setting-accordion.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ProjectDetailSettingAccordionComponent', () => {
  let component: ProjectDetailSettingAccordionComponent;
  let fixture: ComponentFixture<ProjectDetailSettingAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailSettingAccordionComponent, OSFTestingModule, MockComponent(SelectComponent)],
    }).compileComponents();

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
