import { provideStore } from '@ngxs/store';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectors, UserState } from '@core/store/user';
import { AddonsState } from '@osf/shared/stores';

import { ProjectAddonsComponent } from './project-addons.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

describe.skip('Component: Addons', () => {
  let component: ProjectAddonsComponent;
  let fixture: ComponentFixture<ProjectAddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectAddonsComponent, OSFTestingModule],
      providers: [
        provideStore([UserState, AddonsState]),
        {
          provide: UserSelectors,
          useValue: {
            getCurrentUser: () => signal({ id: 'mock-user' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the connected description paragraph', () => {
    component['selectedTab'].set(component['AddonTabValue'].ALL_ADDONS);
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    const p = compiled.querySelector('p');
    expect(p).toBeTruthy();
    expect(p?.textContent?.trim()).toContain('settings.addons.description');
  });

  it('should render the connected description paragraph', () => {
    component['selectedTab'].set(component['AddonTabValue'].CONNECTED_ADDONS);
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    const p = compiled.querySelector('p');
    expect(p).toBeTruthy();
    expect(p?.textContent?.trim()).toContain('settings.addons.connectedDescription');
  });
});
