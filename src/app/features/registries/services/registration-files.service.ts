import { inject, Injectable } from '@angular/core';

import { FilesService } from '@osf/shared/services';
import { JsonApiService } from '@shared/services';

@Injectable({
  providedIn: 'root',
})
export class RegistrationFilesService {
  private filesService = inject(FilesService);
  private jsonApiService = inject(JsonApiService);
}
