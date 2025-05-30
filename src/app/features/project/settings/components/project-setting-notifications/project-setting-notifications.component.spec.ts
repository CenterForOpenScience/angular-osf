import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSettingNotificationsComponent } from './project-setting-notifications.component';

describe('ProjectSettingNotificationsComponent', () => {
  let component: ProjectSettingNotificationsComponent;
  let fixture: ComponentFixture<ProjectSettingNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSettingNotificationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectSettingNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
