import { Observable, Subject } from 'rxjs';

import { Router, UrlTree } from '@angular/router';

export type RouterMockType = Partial<Router> & { events: Observable<any> };

export class RouterMockBuilder {
  private currentUrl = '/';
  private events$ = new Subject<any>();

  private navigateMock: jest.Mock<Promise<boolean>, any[]> = jest.fn().mockResolvedValue(true);
  private navigateByUrlMock: jest.Mock<Promise<boolean>, any[]> = jest.fn().mockResolvedValue(true);
  private createUrlTreeMock: jest.Mock<UrlTree, any[]> = jest.fn(() => ({}) as UrlTree);

  static create(): RouterMockBuilder {
    return new RouterMockBuilder();
  }

  withUrl(url: string): RouterMockBuilder {
    this.currentUrl = url;
    return this;
  }

  withNavigate(mockImpl: jest.Mock<Promise<boolean>, any[]>): RouterMockBuilder {
    this.navigateMock = mockImpl;
    return this;
  }

  withNavigateByUrl(mockImpl: jest.Mock<Promise<boolean>, any[]>): RouterMockBuilder {
    this.navigateByUrlMock = mockImpl;
    return this;
  }

  withCreateUrlTree(mockImpl: jest.Mock<UrlTree, any[]>): RouterMockBuilder {
    this.createUrlTreeMock = mockImpl;
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
    } as RouterMockType;
  }
}

export const RouterMock = {
  withUrl(url: string) {
    return RouterMockBuilder.create().withUrl(url);
  },
  create() {
    return RouterMockBuilder.create();
  },
};
