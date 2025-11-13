import { findChangedFields } from '@osf/shared/helpers/find-changed-fields';
import { UserModel } from '@osf/shared/models/user/user.models';

import { NameForm } from '../models';

export function hasNameChanges(formValue: NameForm, initialUser: Partial<UserModel>): boolean {
  const currentValues = {
    fullName: formValue.fullName.value,
    givenName: formValue.givenName.value,
    middleNames: formValue.middleNames.value,
    familyName: formValue.familyName.value,
    suffix: formValue.suffix.value,
  };

  const initialValues = {
    fullName: initialUser.fullName ?? '',
    givenName: initialUser.givenName ?? '',
    middleNames: initialUser.middleNames ?? '',
    familyName: initialUser.familyName ?? '',
    suffix: initialUser.suffix ?? '',
  };

  const changedFields = findChangedFields(currentValues, initialValues);

  return Object.keys(changedFields).length > 0;
}
