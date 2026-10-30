import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CONTENT_DELETED_ROUTE_DATA, PAGE_NOT_FOUND_ROUTE_DATA } from '@core/constants/page-not-found.constants';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder, provideActivatedRouteMock } from '@testing/providers/route-provider.mock';

import { PageNotFoundComponent } from './page-not-found.component';

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;

  function setup(data: Record<string, unknown> = {}) {
    TestBed.configureTestingModule({
      imports: [PageNotFoundComponent],
      providers: [
        provideOSFCore(),
        provideActivatedRouteMock(ActivatedRouteMockBuilder.create().withData(data).build()),
      ],
    });

    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should expose support email from environment', () => {
    setup();
    expect(component.supportEmail).toBe('support@test.com');
  });

  it('should fall back to page not found keys when route data is empty', () => {
    setup();
    expect(component.titleKey).toBe(PAGE_NOT_FOUND_ROUTE_DATA.titleKey);
    expect(component.messageKey).toBe(PAGE_NOT_FOUND_ROUTE_DATA.messageKey);
  });

  it('should use page not found route data when provided', () => {
    setup(PAGE_NOT_FOUND_ROUTE_DATA);
    expect(component.titleKey).toBe(PAGE_NOT_FOUND_ROUTE_DATA.titleKey);
    expect(component.messageKey).toBe(PAGE_NOT_FOUND_ROUTE_DATA.messageKey);
  });

  it('should use content deleted route data when provided', () => {
    setup(CONTENT_DELETED_ROUTE_DATA);
    expect(component.titleKey).toBe(CONTENT_DELETED_ROUTE_DATA.titleKey);
    expect(component.messageKey).toBe(CONTENT_DELETED_ROUTE_DATA.messageKey);
  });

  it('should render a contact support mailto link', () => {
    setup();
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('mailto:support@test.com');
  });
});
