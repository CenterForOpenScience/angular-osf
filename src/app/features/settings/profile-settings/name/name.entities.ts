import { FormControl } from '@angular/forms';

import { User } from '@core/services/user/user.entity';

export interface Name {
  fullName: string;
  givenName: string;
  middleNames: string;
  familyName: string;
  email?: string;
  suffix: string;
}

export interface NameForm {
  fullName: FormControl<string>;
  givenName: FormControl<string>;
  middleNames: FormControl<string>;
  familyName: FormControl<string>;
  suffix: FormControl<string>;
}

export interface NameDto {
  full_name: string;
  given_name: string;
  family_name: string;
  middle_names: string;
  suffix: string;
  email?: string;
}

export function mapNameToDto(name: Name | Partial<User>): NameDto {
  return {
    full_name: name.fullName ?? '',
    given_name: name.givenName ?? '',
    family_name: name.familyName ?? '',
    middle_names: name.middleNames ?? '',
    suffix: name.suffix ?? '',
    email: name.email ?? '',
  };
}
