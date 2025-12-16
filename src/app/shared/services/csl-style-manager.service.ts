import { catchError, from, Observable, of, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { BUILT_IN_STYLES } from '../constants/built-in-citation-styles.const';
import { StorageItem } from '../models/addons/storage-item.model';

import { CitationsService } from './citations.service';

import * as Cite from '@citation-js/core';

@Injectable({
  providedIn: 'root',
})
export class CslStyleManagerService {
  private readonly citationsService = inject(CitationsService);
  private readonly loadedStyles = new Set<string>();
  private readonly builtInStyles = new Set<string>(BUILT_IN_STYLES);
  private readonly dependentStyleMap = new Map<string, string>();

  ensureStyleLoaded(styleId: string, visited = new Set<string>()): Observable<void> {
    if (this.isStyleAvailable(styleId)) {
      return of(undefined);
    }

    return this.citationsService.fetchCustomCitationFile(styleId).pipe(
      switchMap((cslXml) => this.handleStyleRegistration(styleId, cslXml, visited)),
      tap(() => this.loadedStyles.add(styleId)),
      catchError(() => {
        this.loadedStyles.add(styleId);
        return of(undefined);
      })
    );
  }

  getResolvedStyleId(styleId: string): string {
    return this.dependentStyleMap.get(styleId) ?? styleId;
  }

  formatCitation(item: StorageItem, style: string): string {
    if (!item.csl) return item.itemName || '';

    try {
      const cite = new Cite.Cite(item.csl);
      return cite
        .format('bibliography', {
          format: 'text',
          template: this.getResolvedStyleId(style),
          lang: 'en-US',
        })
        .trim();
    } catch {
      return item.itemName || '';
    }
  }

  clearCache(): void {
    this.loadedStyles.clear();
    this.dependentStyleMap.clear();
  }

  private isStyleAvailable(styleId: string): boolean {
    return this.builtInStyles.has(styleId) || this.loadedStyles.has(styleId) || this.isStyleRegistered(styleId);
  }

  private handleStyleRegistration(styleId: string, cslXml: string, visited = new Set<string>()): Observable<void> {
    const parentStyleId = this.extractParentStyleId(cslXml);

    if (parentStyleId && parentStyleId !== styleId) {
      if (visited.has(parentStyleId)) {
        return this.registerStyle(styleId, cslXml);
      }

      this.dependentStyleMap.set(styleId, parentStyleId);
      visited.add(parentStyleId);
      return this.ensureStyleLoaded(parentStyleId, visited);
    }

    return this.registerStyle(styleId, cslXml);
  }

  private extractParentStyleId(cslXml: string): string | null {
    const match = cslXml.match(/href="[^"]*\/([^/"]+)"[^>]*rel="independent-parent"/);
    return match?.[1] ?? null;
  }

  private registerStyle(styleId: string, cslXml: string): Observable<void> {
    return from(
      Promise.resolve().then(() => {
        if (!cslXml || typeof cslXml !== 'string') {
          throw new Error(`Invalid CSL data for style ${styleId}: not a string`);
        }

        try {
          const config = Cite.plugins.config.get('@csl');
          config.templates.add(styleId, cslXml);
        } catch (error) {
          throw new Error(`Failed to register CSL style ${styleId}: ${error?.toString()}`);
        }
      })
    );
  }

  private isStyleRegistered(styleId: string): boolean {
    try {
      return Cite.plugins.config.get('@csl').templates.has(styleId);
    } catch {
      return false;
    }
  }
}
