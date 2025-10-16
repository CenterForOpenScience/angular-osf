import { catchError, from, Observable, of, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { BUILT_IN_STYLES } from '@shared/constants';

import { CitationsService } from './citations.service';

import * as Cite from '@citation-js/core';

@Injectable({
  providedIn: 'root',
})
export class CslStyleManagerService {
  private readonly citationsService = inject(CitationsService);

  private readonly loadedStyles = new Set<string>();

  private readonly builtInStyles = new Set<string>(BUILT_IN_STYLES);

  ensureStyleLoaded(styleId: string): Observable<void> {
    if (this.builtInStyles.has(styleId)) {
      return of(undefined);
    }

    if (this.loadedStyles.has(styleId)) {
      return of(undefined);
    }

    if (this.isStyleRegistered(styleId)) {
      this.loadedStyles.add(styleId);
      return of(undefined);
    }

    return this.citationsService.fetchCustomCitationFile(styleId).pipe(
      switchMap((cslXml) => this.registerStyle(styleId, cslXml)),
      tap(() => {
        this.loadedStyles.add(styleId);
      }),
      catchError(() => {
        this.loadedStyles.add(styleId);
        return of(undefined);
      })
    );
  }

  private registerStyle(styleId: string, cslXml: string): Observable<void> {
    return from(
      Promise.resolve().then(() => {
        try {
          const config = Cite.plugins.config.get('@csl');
          config.templates.add(styleId, cslXml);
        } catch (error) {
          throw new Error(error?.toString());
        }
      })
    );
  }

  private isStyleRegistered(styleId: string): boolean {
    try {
      const config = Cite.plugins.config.get('@csl');
      return config.templates.has(styleId);
    } catch {
      return false;
    }
  }

  clearCache(): void {
    this.loadedStyles.clear();
  }
}
