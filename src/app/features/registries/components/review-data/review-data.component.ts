import { TranslatePipe } from '@ngx-translate/core';

import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants';

import { FieldType } from '../../enums';
import { Question } from '../../models';

@Component({
  selector: 'osf-review-data',
  imports: [Tag, TranslatePipe, Message],
  templateUrl: './review-data.component.html',
  styleUrl: './review-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewDataComponent {
  questions = input<Question[]>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reviewData = input<Record<string, any>>({});
  protected readonly FieldType = FieldType;
  protected readonly INPUT_VALIDATION_MESSAGES = INPUT_VALIDATION_MESSAGES;
}
