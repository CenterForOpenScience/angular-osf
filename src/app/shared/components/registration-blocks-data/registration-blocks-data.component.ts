import { TranslatePipe } from '@ngx-translate/core';

import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants';
import { FieldType } from '@osf/shared/enums';
import { Question } from '@osf/shared/models';

import { FileLinkComponent } from '../file-link/file-link.component';

@Component({
  selector: 'osf-registration-blocks-data',
  imports: [Tag, TranslatePipe, Message, FileLinkComponent],
  templateUrl: './registration-blocks-data.component.html',
  styleUrl: './registration-blocks-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationBlocksDataComponent {
  questions = input<Question[]>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reviewData = input<Record<string, any>>({});
  isOverviewPage = input<boolean>(false);
  updatedFields = input<string[]>([]);
  isOriginalRevision = input<boolean>(true);

  updatedKeysMap = computed<Record<string, boolean>>(() => {
    return this.updatedFields().reduce((acc, key) => {
      return { ...acc, [key]: true };
    }, {});
  });

  protected readonly FieldType = FieldType;
  protected readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;
}
