import { SubmitSteps } from '@osf/features/preprints/enums';
import { CustomOption } from '@shared/models';

export const submitPreprintSteps: CustomOption<SubmitSteps>[] = Object.entries(SubmitSteps)
  .filter(([, value]) => typeof value === 'number')
  .map(([, value]) => {
    let label = '';
    switch (value) {
      case SubmitSteps.TitleAndAbstract:
        label = 'Title and Abstract';
        break;
      case SubmitSteps.File:
        label = 'File';
        break;
      case SubmitSteps.Metadata:
        label = 'Metadata';
        break;
      case SubmitSteps.AuthorAssertions:
        label = 'Author Assertions';
        break;
      case SubmitSteps.Supplements:
        label = 'Supplements';
        break;
      case SubmitSteps.Review:
        label = 'Review';
        break;
    }

    return {
      label,
      value: value as SubmitSteps,
    };
  });
