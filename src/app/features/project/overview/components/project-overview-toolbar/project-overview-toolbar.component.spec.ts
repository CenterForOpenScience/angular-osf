import { MockComponent } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialsShareButtonComponent } from '@osf/shared/components/socials-share-button/socials-share-button.component';

import { ProjectOverviewToolbarComponent } from './project-overview-toolbar.component';

describe('ProjectOverviewToolbarComponent', () => {
  let component: ProjectOverviewToolbarComponent;
  let fixture: ComponentFixture<ProjectOverviewToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectOverviewToolbarComponent, MockComponent(SocialsShareButtonComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectOverviewToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
