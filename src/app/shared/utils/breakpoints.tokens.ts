import { inject, InjectionToken } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map } from 'rxjs';
import { BreakpointQueries } from '@shared/utils/breakpoint-queries.enum';

function createBreakpointToken(
  query: string,
): InjectionToken<Observable<boolean>> {
  return new InjectionToken<Observable<boolean>>(`Breakpoint ${query}`, {
    providedIn: 'root',
    factory: () => {
      const breakpointObserver = inject(BreakpointObserver);
      return breakpointObserver
        .observe([query])
        .pipe(map((result) => result.matches));
    },
  });
}

export const IS_PORTRAIT = createBreakpointToken(BreakpointQueries.Portrait);
export const IS_WEB = createBreakpointToken(BreakpointQueries.Desktop);
export const IS_TABLET = createBreakpointToken(Breakpoints.Tablet);
export const IS_XSMALL = createBreakpointToken(Breakpoints.XSmall);
export const IS_SMALL = createBreakpointToken(Breakpoints.Small);
export const IS_MEDIUM = createBreakpointToken(Breakpoints.Medium);
