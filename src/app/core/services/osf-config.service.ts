import { catchError, lastValueFrom, of, shareReplay } from 'rxjs';

import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

import { SSR_CONFIG } from '@core/constants/ssr-config.token';
import { ConfigModel } from '@core/models/config.model';
import { ENVIRONMENT } from '@core/provider/environment.provider';

@Injectable({ providedIn: 'root' })
export class OSFConfigService {
  private http: HttpClient = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private environment = inject(ENVIRONMENT);
  private ssrConfig = inject(SSR_CONFIG, { optional: true });
  private config: ConfigModel | null = null;

  async load(): Promise<void> {
    if (this.config) return;

    if (isPlatformBrowser(this.platformId)) {
      this.config = await lastValueFrom<ConfigModel>(
        this.http.get<ConfigModel>('/assets/config/config.json').pipe(
          shareReplay(1),
          catchError(() => of({} as ConfigModel))
        )
      );
    } else {
      this.config = (this.ssrConfig ?? {}) as ConfigModel;
    }

    for (const [key, value] of Object.entries(this.config)) {
      // eslint-disable-next-line
      // @ts-ignore
      this.environment[key] = value;
    }
  }
}
