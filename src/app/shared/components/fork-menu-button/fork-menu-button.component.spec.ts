import { MenuItem } from 'primeng/api';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { ForkMenuButtonComponent } from './fork-menu-button.component';

interface SetupOverrides {
  forksCount?: number;
  menuItems?: MenuItem[];
  preventDuplicateCreation?: boolean;
}

describe('ForkMenuButtonComponent', () => {
  let component: ForkMenuButtonComponent;
  let fixture: ComponentFixture<ForkMenuButtonComponent>;

  const defaultMenuItems: MenuItem[] = [
    { label: 'project.overview.actions.forkProject' },
    { label: 'project.overview.actions.viewDuplication' },
  ];

  function setup(overrides: SetupOverrides = {}) {
    TestBed.configureTestingModule({
      imports: [ForkMenuButtonComponent],
      providers: [provideOSFCore()],
    });

    fixture = TestBed.createComponent(ForkMenuButtonComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('forksCount', overrides.forksCount ?? 3);
    fixture.componentRef.setInput('menuItems', overrides.menuItems ?? defaultMenuItems);
    fixture.componentRef.setInput('preventDuplicateCreation', overrides.preventDuplicateCreation ?? false);
    fixture.detectChanges();
  }

  it('should show the forks count', () => {
    setup({ forksCount: 7 });

    expect(fixture.nativeElement.textContent).toContain('7');
  });

  it('should show the menu when duplicate creation is allowed', () => {
    setup();

    expect(fixture.nativeElement.querySelector('p-menu')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('button')?.getAttribute('aria-label')).toBe(
      'project.overview.tooltips.duplicate'
    );
  });

  it('should show the view duplicates button when duplicate creation is prevented', () => {
    setup({ preventDuplicateCreation: true });

    expect(fixture.nativeElement.querySelector('p-menu')).toBeNull();
    expect(fixture.nativeElement.querySelector('button')?.getAttribute('aria-label')).toBe(
      'project.overview.actions.viewDuplication'
    );
  });

  it('should emit viewDuplicates when the view duplicates button is clicked', () => {
    setup({ preventDuplicateCreation: true });
    const viewDuplicatesSpy = vi.fn();
    component.viewDuplicates.subscribe(viewDuplicatesSpy);

    fixture.nativeElement.querySelector('button').click();

    expect(viewDuplicatesSpy).toHaveBeenCalledOnce();
  });
});
