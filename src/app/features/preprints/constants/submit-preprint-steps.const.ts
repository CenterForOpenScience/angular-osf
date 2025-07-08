import { SubmitSteps } from '@osf/features/preprints/enums';
import { StepOption } from '@shared/models';

export const submitPreprintSteps: StepOption[] = [
  {
    index: SubmitSteps.TitleAndAbstract,
    label: 'Title and Abstract',
    value: SubmitSteps.TitleAndAbstract,
  },
  {
    index: SubmitSteps.File,
    label: 'File',
    value: SubmitSteps.File,
  },
  {
    index: SubmitSteps.Metadata,
    label: 'Metadata',
    value: SubmitSteps.Metadata,
  },
  {
    index: SubmitSteps.AuthorAssertions,
    label: 'Author Assertions',
    value: SubmitSteps.AuthorAssertions,
  },
  {
    index: SubmitSteps.Supplements,
    label: 'Supplements',
    value: SubmitSteps.Supplements,
  },
  {
    index: SubmitSteps.Review,
    label: 'Review',
    value: SubmitSteps.Review,
  },
];
