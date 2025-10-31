import { map, Observable } from 'rxjs';

import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, InjectionToken } from '@angular/core';

import { BreakpointQueries } from '../enums/breakpoint-queries.enum';

function createBreakpointToken(query: string): InjectionToken<Observable<boolean>> {
  return new InjectionToken<Observable<boolean>>(`Breakpoint ${query}`, {
    providedIn: 'root',
    factory: () => {
      const breakpointObserver = inject(BreakpointObserver);
      return breakpointObserver.observe([query]).pipe(map((result) => result.matches));
    },
  });
}

export const IS_XSMALL = createBreakpointToken(BreakpointQueries.xs);
export const IS_SMALL = createBreakpointToken(BreakpointQueries.sm);
export const IS_MEDIUM = createBreakpointToken(BreakpointQueries.md);
export const IS_LARGE = createBreakpointToken(BreakpointQueries.lg);
export const IS_WEB = createBreakpointToken(BreakpointQueries.xl);
