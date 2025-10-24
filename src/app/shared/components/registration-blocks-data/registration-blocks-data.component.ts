import { TranslatePipe } from '@ngx-translate/core';

import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants';
import { FieldType } from '@osf/shared/enums';
import { Question } from '@osf/shared/models';
import { FixSpecialCharPipe } from '@shared/pipes';

@Component({
  selector: 'osf-registration-blocks-data',
  imports: [FixSpecialCharPipe, Tag, TranslatePipe, Message],
  templateUrl: './registration-blocks-data.component.html',
  styleUrl: './registration-blocks-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationBlocksDataComponent {
  questions = input<Question[]>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reviewData = input<Record<string, any>>({});
  updatedFields = input<string[]>([]);
  isDraft = input<boolean>(false);
  isOverviewPage = input<boolean>(false);
  isOriginalRevision = input<boolean>(true);

  updatedKeysMap = computed<Record<string, boolean>>(() => {
    return this.updatedFields().reduce((acc, key) => {
      return { ...acc, [key]: true };
    }, {});
  });

  readonly FieldType = FieldType;
  readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;
}
