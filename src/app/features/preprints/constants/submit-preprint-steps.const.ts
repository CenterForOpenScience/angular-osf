import { SubmitSteps } from '@osf/features/preprints/enums';
import { StepOption } from '@shared/models';

export const submitPreprintSteps: StepOption[] = [
  {
    index: 0,
    label: 'Title and Abstract',
    value: SubmitSteps.TitleAndAbstract,
  },
  {
    index: 1,
    label: 'File',
    value: SubmitSteps.File,
  },
  {
    index: 2,
    label: 'Metadata',
    value: SubmitSteps.Metadata,
  },
  {
    index: 3,
    label: 'Author Assertions',
    value: SubmitSteps.AuthorAssertions,
  },
  {
    index: 4,
    label: 'Supplements',
    value: SubmitSteps.Supplements,
  },
  {
    index: 5,
    label: 'Review',
    value: SubmitSteps.Review,
  },
];
