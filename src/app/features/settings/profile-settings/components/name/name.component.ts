import { select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';

import { ChangeDetectionStrategy, Component, effect, HostBinding, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { NameForm } from '../../models';
import { ProfileSettingsSelectors, UpdateProfileSettingsUser } from '../../store';

@Component({
  selector: 'osf-name',
  imports: [Button, InputText, ReactiveFormsModule, TranslatePipe],
  templateUrl: './name.component.html',
  styleUrl: './name.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NameComponent {
  @HostBinding('class') classes = 'flex flex-column gap-4 flex-1';

  readonly fb = inject(FormBuilder);
  readonly form = this.fb.group<NameForm>({
    fullName: this.fb.control('', { nonNullable: true }),
    givenName: this.fb.control('', { nonNullable: true }),
    middleNames: this.fb.control('', { nonNullable: true }),
    familyName: this.fb.control('', { nonNullable: true }),
    suffix: this.fb.control('', { nonNullable: true }),
  });
  readonly store = inject(Store);
  readonly nameState = select(ProfileSettingsSelectors.user);

  constructor() {
    effect(() => {
      const user = this.nameState();
      this.form.patchValue({
        fullName: user.fullName,
        givenName: user.givenName,
        middleNames: user.middleNames,
        familyName: user.familyName,
        suffix: user.suffix,
      });
    });
  }

  saveChanges() {
    const { fullName, givenName, middleNames, familyName, suffix } = this.form.getRawValue();
    this.store.dispatch(
      new UpdateProfileSettingsUser({
        user: {
          fullName,
          givenName,
          middleNames,
          familyName,
          suffix,
        },
      })
    );
  }
}
