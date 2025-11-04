import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpScoutService } from '@core/services/help-scout.service';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';

import { ProjectComponent } from './project.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

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
        provideMockStore({
          signals: [{ selector: CurrentResourceSelectors.getCurrentResource, value: null }],
        }),
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
