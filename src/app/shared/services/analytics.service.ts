import {inject, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private apiUrl = 'https://api.osf.io/_/metrics/events/counted_usage';
  private readonly http: HttpClient = inject(HttpClient);


  async sendCountedUsage(payload: object): Promise<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
    });

    this.http.post(this.apiUrl, payload, { headers }).subscribe({
        next: () => console.log('Usage event sent', payload),
        error: err => console.error('Error sending usage event', err),
      });
  }
}
