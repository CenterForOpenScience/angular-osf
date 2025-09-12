import { CookieService } from 'ngx-cookie-service';

import { MessageModule } from 'primeng/message';

import { of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MaintenanceBannerComponent } from './maintenance-banner.component';

describe('MaintenanceBannerComponent', () => {
  let fixture: ComponentFixture<MaintenanceBannerComponent>;
  let httpClient: { get: jest.Mock };
  let cookieService: jest.Mocked<CookieService>;

  beforeEach(async () => {
    cookieService = {
      check: jest.fn(),
      set: jest.fn(),
    } as any;
    httpClient = { get: jest.fn() } as any;
    await TestBed.configureTestingModule({
      imports: [MaintenanceBannerComponent, NoopAnimationsModule, MessageModule],
      providers: [
        { provide: CookieService, useValue: cookieService },
        { provide: HttpClient, useValue: httpClient },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceBannerComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render info banner when maintenance data is present', fakeAsync(() => {
    cookieService.check.mockReturnValue(false);
    const now = new Date();
    const start = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    httpClient.get.mockReturnValueOnce(
      of({
        maintenance: { level: 1, message: 'Info message', start, end },
      })
    );
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const banner = fixture.debugElement.query(By.css('p-message'));
    expect(banner).toBeTruthy();
    expect(banner.componentInstance.severity).toBe('info');
    expect(banner.nativeElement.textContent).toContain('Info message');
  }));

  it('should render warning banner when level is 2', fakeAsync(() => {
    cookieService.check.mockReturnValue(false);
    const now = new Date();
    const start = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    httpClient.get.mockReturnValueOnce(
      of({
        maintenance: {
          level: 2,
          message: 'Warning message',
          start,
          end,
        },
      })
    );
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const banner = fixture.debugElement.query(By.css('p-message'));
    expect(banner).toBeTruthy();
    expect(banner.componentInstance.severity).toBe('warn');
    expect(banner.nativeElement.textContent).toContain('Warning message');
  }));

  it('should render danger banner when level is 3', fakeAsync(() => {
    cookieService.check.mockReturnValue(false);
    const now = new Date();
    const start = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    httpClient.get.mockReturnValueOnce(
      of({
        maintenance: {
          level: 3,
          message: 'Danger message',
          start,
          end,
        },
      })
    );
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const banner = fixture.debugElement.query(By.css('p-message'));
    expect(banner).toBeTruthy();
    expect(banner.componentInstance.severity).toBe('error');
    expect(banner.nativeElement.textContent).toContain('Danger message');
  }));

  it('should not render banner if cookie is set', fakeAsync(() => {
    cookieService.check.mockReturnValue(true);
    fixture.detectChanges();
    expect(httpClient.get).not.toHaveBeenCalled();
    fixture.detectChanges();
    const banner = fixture.debugElement.query(By.css('p-message'));
    expect(banner).toBeFalsy();
  }));

  it('should not render banner if outside maintenance window', fakeAsync(() => {
    cookieService.check.mockReturnValue(false);
    httpClient.get.mockReturnValueOnce(
      of({
        maintenance: { level: 1, message: 'Old message', start: '2020-01-01T00:00:00Z', end: '2020-01-02T00:00:00Z' },
      })
    );
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const banner = fixture.debugElement.query(By.css('p-message'));
    expect(banner).toBeFalsy();
  }));

  it('should dismiss banner when close button is clicked', fakeAsync(() => {
    cookieService.check.mockReturnValue(false);
    const now = new Date();
    const start = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const end = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    httpClient.get.mockReturnValueOnce(
      of({
        maintenance: { level: 1, message: 'Dismiss me', start, end },
      })
    );
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const banner = fixture.debugElement.query(By.css('p-message'));
    expect(banner).toBeTruthy();
    banner.triggerEventHandler('onClose', {});
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('p-message'))).toBeFalsy();
    expect(cookieService.set).toHaveBeenCalled();
  }));
});
