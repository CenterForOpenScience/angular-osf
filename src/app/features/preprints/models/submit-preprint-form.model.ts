import { FormControl } from '@angular/forms';

import { StringOrNull } from '@osf/shared/helpers/types.helper';
import { SubjectModel } from '@shared/models/subject/subject.model';

export interface TitleAndAbstractForm {
  title: FormControl<string>;
  description: FormControl<string>;
}

export interface MetadataForm {
  doi: FormControl<StringOrNull>;
  originalPublicationDate: FormControl<Date | null>;
  customPublicationCitation: FormControl<StringOrNull>;
  tags: FormControl<string[]>;
  subjects: FormControl<SubjectModel[]>;
}
