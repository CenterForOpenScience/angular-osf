import { PreregLinkInfo } from '@osf/features/preprints/enums';
import { SelectOption } from '@shared/models';

export const preregLinksOptions: SelectOption[] = [
  {
    label: 'Analysis Plan',
    value: PreregLinkInfo.Analysis,
  },
  {
    label: 'Study Design',
    value: PreregLinkInfo.Designs,
  },
  {
    label: 'Both',
    value: PreregLinkInfo.Both,
  },
];
