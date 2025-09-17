import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { MetadataRecordFormat } from '../enums';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetadataRecordsService {
  private readonly http: HttpClient = inject(HttpClient);

  metadataRecordUrl(osfid: string, format: MetadataRecordFormat): string {
    return `${environment.webUrl}/metadata/${osfid}/?format=${format}`;
  }

  getMetadataRecord(osfid: string, format: MetadataRecordFormat): Observable<string> {
    return this.http.get(this.metadataRecordUrl(osfid, format), { responseType: 'text' });
  }
}
