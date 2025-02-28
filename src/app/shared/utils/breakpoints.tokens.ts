import { inject, InjectionToken } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map } from 'rxjs';

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

export const IS_XSMALL = createBreakpointToken(Breakpoints.XSmall);
export const IS_SMALL = createBreakpointToken(Breakpoints.Small);
export const IS_MEDIUM = createBreakpointToken(Breakpoints.Medium);
export const IS_LARGE = createBreakpointToken(Breakpoints.Large);
export const IS_XLARGE = createBreakpointToken(Breakpoints.XLarge);
export const IS_PORTRAIT = createBreakpointToken('(orientation: portrait)');
