import { SelectOption } from '@osf/shared/models';

import { PreregLinkInfo } from '../enums';

export const preregLinksOptions: SelectOption[] = [
  {
    label: 'preprints.preprintStepper.common.labels.preregTypes.analysis',
    value: PreregLinkInfo.Analysis,
  },
  {
    label: 'preprints.preprintStepper.common.labels.preregTypes.designs',
    value: PreregLinkInfo.Designs,
  },
  {
    label: 'preprints.preprintStepper.common.labels.preregTypes.both',
    value: PreregLinkInfo.Both,
  },
];
