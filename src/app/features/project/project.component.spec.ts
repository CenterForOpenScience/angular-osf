import { MockProvider } from 'ng-mocks';

import { BehaviorSubject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpScoutService } from '@core/services/help-scout.service';
import { IS_WEB } from '@osf/shared/helpers';

import { ProjectComponent } from './project.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe('Component: Project', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;
  let isWebSubject: BehaviorSubject<boolean>;
  let helpScountService: HelpScoutService;

  beforeEach(async () => {
    isWebSubject = new BehaviorSubject<boolean>(true);

    await TestBed.configureTestingModule({
      imports: [ProjectComponent, OSFTestingModule],
      providers: [
        MockProvider(IS_WEB, isWebSubject),
        {
          provide: HelpScoutService,
          useValue: {
            setResourceType: jest.fn(),
            unsetResourceType: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    helpScountService = TestBed.inject(HelpScoutService);
    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have a default value', () => {
    expect(component.classes).toBe('flex flex-1 flex-column w-full');
  });

  it('should called the helpScoutService', () => {
    expect(helpScountService.setResourceType).toHaveBeenCalledWith('project');
  });
});
