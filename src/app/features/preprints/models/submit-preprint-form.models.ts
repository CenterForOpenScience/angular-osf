import { FormControl } from '@angular/forms';

export interface TitleAndAbstractForm {
  title: FormControl<string>;
  description: FormControl<string>;
}
