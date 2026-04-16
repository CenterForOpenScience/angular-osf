import { Observable, Subject } from 'rxjs';

import { Mock } from 'vitest';

import { Router, UrlTree } from '@angular/router';

export type RouterMockType = Partial<Router> & {
  events: Observable<any>;
  navigate: Mock<(...args: any[]) => Promise<boolean>>;
  navigateByUrl: Mock<(...args: any[]) => Promise<boolean>>;
  createUrlTree: Mock<(...args: any[]) => UrlTree>;
  serializeUrl: Mock<(...args: any[]) => string>;
};

export class RouterMockBuilder {
  private currentUrl = '/';
  private events$ = new Subject<any>();

  private navigateMock: Mock<(...args: any[]) => Promise<boolean>> = vi.fn().mockResolvedValue(true);
  private navigateByUrlMock: Mock<(...args: any[]) => Promise<boolean>> = vi.fn().mockResolvedValue(true);
  private createUrlTreeMock: Mock<(...args: any[]) => UrlTree> = vi.fn(() => ({}) as UrlTree);
  private serializeUrlMock: Mock<(...args: any[]) => string> = vi.fn(() => '/');

  static create(): RouterMockBuilder {
    return new RouterMockBuilder();
  }

  withUrl(url: string): RouterMockBuilder {
    this.currentUrl = url;
    return this;
  }

  withNavigate(mockImpl: Mock<(...args: any[]) => Promise<boolean>>): RouterMockBuilder {
    this.navigateMock = mockImpl;
    return this;
  }

  withNavigateByUrl(mockImpl: Mock<(...args: any[]) => Promise<boolean>>): RouterMockBuilder {
    this.navigateByUrlMock = mockImpl;
    return this;
  }

  withCreateUrlTree(mockImpl: Mock<(...args: any[]) => UrlTree>): RouterMockBuilder {
    this.createUrlTreeMock = mockImpl;
    return this;
  }

  withSerializeUrl(mockImpl: Mock<(...args: any[]) => string>): RouterMockBuilder {
    this.serializeUrlMock = mockImpl;
    return this;
  }

  emit(event: any): RouterMockBuilder {
    this.events$.next(event);
    return this;
  }

  build(): RouterMockType {
    return {
      url: this.currentUrl,
      events: this.events$.asObservable(),
      navigate: this.navigateMock,
      navigateByUrl: this.navigateByUrlMock,
      createUrlTree: this.createUrlTreeMock,
      serializeUrl: this.serializeUrlMock,
    } as RouterMockType;
  }
}

export function provideRouterMock(mock?: RouterMockType) {
  return {
    provide: Router,
    useFactory: () => mock ?? RouterMockBuilder.create().build(),
  };
}
