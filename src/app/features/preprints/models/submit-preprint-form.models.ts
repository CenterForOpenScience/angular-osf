import { FormControl } from '@angular/forms';

import { StringOrNull } from '@core/helpers';

export interface TitleAndAbstractForm {
  title: FormControl<string>;
  description: FormControl<string>;
}

export interface MetadataForm {
  doi: FormControl<string>;
  originalPublicationDate: FormControl<Date | null>;
  customPublicationCitation: FormControl<StringOrNull>;
}
