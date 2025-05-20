import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';

import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let router: Router;

  const mockRouter = {
    url: '/test/path',
    events: of(new NavigationEnd(1, '/test/path', '/test/path')),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [MockProvider(Router, mockRouter)],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and parse URL correctly', () => {
    expect(component).toBeTruthy();
    expect(component['url']()).toBe('/test/path');
    expect(component['parsedUrl']()).toEqual(['test', 'path']);
  });

  it('should not show breadcrumb for home page', () => {
    Object.defineProperty(router, 'url', { value: '/home' });
    component['url'].set('/home');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.breadcrumbs')).toBeNull();
  });

  it('should show breadcrumb for valid path', () => {
    Object.defineProperty(router, 'url', { value: '/settings/profile' });
    component['url'].set('/settings/profile');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const breadcrumbs = compiled.querySelector('.breadcrumbs');
    expect(breadcrumbs).toBeTruthy();
    expect(breadcrumbs?.textContent).toContain('settings');
    expect(breadcrumbs?.textContent).toContain('profile');
  });
});
