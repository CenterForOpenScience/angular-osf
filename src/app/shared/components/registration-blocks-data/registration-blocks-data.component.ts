import { TranslatePipe } from '@ngx-translate/core';

import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';

import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { INPUT_VALIDATION_MESSAGES } from '@osf/shared/constants/input-validation-messages.const';
import { FieldType } from '@osf/shared/enums/field-type.enum';
import { Question } from '@osf/shared/models/registration/page-schema.model';
import { FixSpecialCharPipe } from '@osf/shared/pipes/fix-special-char.pipe';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

@Component({
  selector: 'osf-registration-blocks-data',
  imports: [FixSpecialCharPipe, Tag, TranslatePipe, Message],
  templateUrl: './registration-blocks-data.component.html',
  styleUrl: './registration-blocks-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationBlocksDataComponent {
  private readonly router = inject(Router);
  private readonly viewOnlyService = inject(ViewOnlyLinkHelperService);

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

  getFileUrl(htmlUrl?: string): string {
    if (!htmlUrl) {
      return '';
    }

    const viewOnly = this.viewOnlyService.getViewOnlyParamFromUrl(this.router.url);

    if (!viewOnly) {
      return htmlUrl;
    }

    const url = new URL(htmlUrl);
    url.searchParams.set('view_only', viewOnly);
    return url.toString();
  }
}
