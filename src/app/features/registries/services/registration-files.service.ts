import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services';
import { FilesService } from '@osf/shared/services';

@Injectable({
  providedIn: 'root',
})
export class RegistrationFilesService {
  private filesService = inject(FilesService);
  private jsonApiService = inject(JsonApiService);
}
