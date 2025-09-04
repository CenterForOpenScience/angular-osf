// test-utils/ngxs-mock-store.ts
import { Store } from '@ngxs/store';

import { Observable, of } from 'rxjs';

import { Provider, signal } from '@angular/core';

interface SelectorMock<T = any> {
  selector: any;
  value: T;
}

interface ProvideMockStoreOptions {
  selectors?: SelectorMock[];
  signals?: SelectorMock[];
}

export function provideMockStore(options: ProvideMockStoreOptions = {}): Provider {
  const selectorMap = new Map<any, any>();
  const signalMap = new Map<any, any>();

  (options.selectors || []).forEach(({ selector, value }) => {
    selectorMap.set(selector, value);
  });

  (options.signals || []).forEach(({ selector, value }) => {
    signalMap.set(selector, value);
  });

  const storeMock = {
    select: (selector: any): Observable<any> => {
      return of(selectorMap.has(selector) ? selectorMap.get(selector) : undefined);
    },
    selectSnapshot: (selector: any): any => {
      return selectorMap.get(selector);
    },
    selectSignal: (selector: any) => {
      return signal(signalMap.has(selector) ? signalMap.get(selector) : undefined);
    },
    dispatch: jest.fn(),
  };

  return {
    provide: Store,
    useValue: storeMock,
  };
}
