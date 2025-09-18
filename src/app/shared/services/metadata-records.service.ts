import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { MetadataRecordFormat } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class MetadataRecordsService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly environment = inject(ENVIRONMENT);
  private readonly webUrl = this.environment.webUrl;

  metadataRecordUrl(osfid: string, format: MetadataRecordFormat): string {
    return `${this.webUrl}/metadata/${osfid}/?format=${format}`;
  }

  getMetadataRecord(osfid: string, format: MetadataRecordFormat): Observable<string> {
    return this.http.get(this.metadataRecordUrl(osfid, format), { responseType: 'text' });
  }
}
