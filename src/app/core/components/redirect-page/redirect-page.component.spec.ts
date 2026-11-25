import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WINDOW } from '@core/provider/window.provider';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource/current-resource.selectors';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { RedirectPageComponent } from './redirect-page.component';

const mockResource = {
  id: 'mock-resource-id',
  type: 'mock-resource-type',
  redirectUrl: 'https://example.com',
  permissions: [],
  redirectAutomatically: false,
};

describe('RedirectPageComponent', () => {
  let component: RedirectPageComponent;
  let fixture: ComponentFixture<RedirectPageComponent>;
  let windowMock: any;

  afterEach(() => {
    vi.useRealTimers();
  });

  const setup = (override?: Partial<typeof mockResource>) => {
    const resource = { ...mockResource, ...override };
    const historyMock = { back: vi.fn() };
    windowMock = { history: historyMock, location: { href: '', set: vi.fn() } };
    TestBed.configureTestingModule({
      imports: [RedirectPageComponent],
      providers: [
        provideOSFCore(),
        MockProvider(WINDOW, windowMock),
        provideMockStore({
          signals: [{ selector: CurrentResourceSelectors.getCurrentResource, value: resource }],
        }),
      ],
    });

    fixture = TestBed.createComponent(RedirectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should have redirectDestination when resource has redirect URL', () => {
    setup();
    expect(component.redirectDestination()).toBe(mockResource.redirectUrl);
  });

  it('should not have redirectDestination when resource has no redirect URL', () => {
    setup({ redirectUrl: undefined });
    expect(component.redirectDestination()).toBe('');
  });

  it('should render continue link and go back button', () => {
    setup();
    const continueLink = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(continueLink.getAttribute('href')).toBe(component.redirectDestination());
    const backButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(backButton).toBeTruthy();
  });

  it('should call goBack when go back button is clicked', () => {
    setup();
    const goBackSpy = vi.spyOn(windowMock.history, 'back');
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    expect(goBackSpy).toHaveBeenCalled();
  });

  it('should not redirect when redirectDestination is empty', () => {
    vi.useFakeTimers();
    setup({ redirectUrl: undefined });
    const redirectSpy = vi.spyOn(windowMock.location, 'href', 'set');
    vi.advanceTimersByTime(component.redirectDelay);
    expect(redirectSpy).not.toHaveBeenCalled();
  });

  it('should automatically redirect after redirectDelay amount of time', () => {
    vi.useFakeTimers();
    setup();
    const redirectSpy = vi.spyOn(windowMock.location, 'href', 'set');
    vi.advanceTimersByTime(component.redirectDelay);
    expect(redirectSpy).toHaveBeenCalledWith(component.redirectDestination());
  });

  it('should not redirect if component is destroyed before redirectDelay', () => {
    vi.useFakeTimers();
    setup();
    const redirectSpy = vi.spyOn(windowMock.location, 'href', 'set');
    fixture.destroy();
    vi.advanceTimersByTime(component.redirectDelay);
    expect(redirectSpy).not.toHaveBeenCalled();
  });
});
