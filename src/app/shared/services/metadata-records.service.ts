import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { MetadataRecordFormat } from '../enums/metadata-record-format.enum';

@Injectable({
  providedIn: 'root',
})
export class MetadataRecordsService {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(ENVIRONMENT);

  get webUrl() {
    return this.environment.webUrl;
  }

  getMetadataRecord(osfid: string, format: MetadataRecordFormat) {
    const url = `${this.webUrl}/metadata/${osfid}/?format=${format}`;
    return this.http.get(url, {
      responseType: 'text',
      headers: new HttpHeaders({ 'X-No-Auth-Redirect': 'true' }),
    });
  }
}
