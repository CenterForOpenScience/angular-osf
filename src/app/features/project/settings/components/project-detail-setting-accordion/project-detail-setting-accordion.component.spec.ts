import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailSettingAccordionComponent } from './project-detail-setting-accordion.component';

describe('AccordionTableComponent', () => {
  let component: ProjectDetailSettingAccordionComponent;
  let fixture: ComponentFixture<ProjectDetailSettingAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailSettingAccordionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDetailSettingAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
