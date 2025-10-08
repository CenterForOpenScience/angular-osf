import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpScoutService } from '@core/services/help-scout.service';

import { ProjectComponent } from './project.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Component: Project', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;
  let helpScoutService: HelpScoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectComponent, OSFTestingModule],
      providers: [
        {
          provide: HelpScoutService,
          useValue: {
            setResourceType: jest.fn(),
            unsetResourceType: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    helpScoutService = TestBed.inject(HelpScoutService);
    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have a default value', () => {
    expect(component.classes).toBe('flex flex-1 flex-column w-full');
  });

  it('should called the helpScoutService', () => {
    expect(helpScoutService.setResourceType).toHaveBeenCalledWith('project');
  });
});
