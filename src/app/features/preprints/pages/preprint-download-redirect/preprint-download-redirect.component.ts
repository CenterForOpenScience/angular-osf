import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'osf-preprint-download-redirect',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintDownloadRedirectComponent {
  constructor() {
    const route = inject(ActivatedRoute);
    const id = route.snapshot.paramMap.get('id') ?? '';

    if (id) {
      window.location.href = `/download/${id}`;
    }
  }
}
