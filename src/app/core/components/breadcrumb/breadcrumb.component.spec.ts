import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { BreadcrumbComponent } from './breadcrumb.component';

describe('Component: Breadcrumb', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  const mockRouter = {
    url: '/test/path',
    events: of(new NavigationEnd(1, '/test/path', '/test/path')),
  };

  const mockActivatedRoute = {
    snapshot: {
      data: { skipBreadcrumbs: false },
    },
    firstChild: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [MockProvider(Router, mockRouter), { provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and parse URL correctly', () => {
    expect(component).toBeTruthy();
    expect(component['url']()).toBe('/test/path');
    expect(component['parsedUrl']()).toEqual(['test', 'path']);
  });
});
