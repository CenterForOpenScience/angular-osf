import { CookieService } from 'ngx-cookie-service';

import { of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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
      imports: [MaintenanceBannerComponent],
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
    httpClient.get.mockReturnValueOnce(of({ maintenance: { level: 1, message: 'Info message' } }));
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const banner = fixture.debugElement.query(By.css('.maintenance-banner'));
    expect(banner).toBeTruthy();
    expect(banner.nativeElement.textContent).toContain('Info message');
    expect(banner.nativeElement.className).toContain('info');
  }));

  it('should render warning banner when level is 2', fakeAsync(() => {
    cookieService.check.mockReturnValue(false);
    httpClient.get.mockReturnValueOnce(of({ maintenance: { level: 2, message: 'Warning message' } }));
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const banner = fixture.debugElement.query(By.css('.maintenance-banner'));
    expect(banner).toBeTruthy();
    expect(banner.nativeElement.textContent).toContain('Warning message');
    expect(banner.nativeElement.className).toContain('warning');
  }));

  it('should render danger banner when level is 3', fakeAsync(() => {
    cookieService.check.mockReturnValue(false);
    httpClient.get.mockReturnValueOnce(of({ maintenance: { level: 3, message: 'Danger message' } }));
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const banner = fixture.debugElement.query(By.css('.maintenance-banner'));
    expect(banner).toBeTruthy();
    expect(banner.nativeElement.textContent).toContain('Danger message');
    expect(banner.nativeElement.className).toContain('danger');
  }));

  it('should not render banner if cookie is set', fakeAsync(() => {
    cookieService.check.mockReturnValue(true);
    fixture.detectChanges();
    expect(httpClient.get).not.toHaveBeenCalled();
    fixture.detectChanges();
    const banner = fixture.debugElement.query(By.css('.maintenance-banner'));
    expect(banner).toBeFalsy();
  }));

  it('should dismiss banner when close button is clicked', fakeAsync(() => {
    cookieService.check.mockReturnValue(false);
    httpClient.get.mockReturnValueOnce(of({ maintenance: { level: 1, message: 'Dismiss me' } }));
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const closeBtn = fixture.debugElement.query(By.css('.maintenance-banner__dismiss'));
    expect(closeBtn).toBeTruthy();
    closeBtn.nativeElement.click();
    fixture.detectChanges();
    const banner = fixture.debugElement.query(By.css('.maintenance-banner'));
    expect(banner).toBeFalsy();
    expect(cookieService.set).toHaveBeenCalled();
  }));
});
