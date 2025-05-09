import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostBinding,
  inject,
} from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { ProfileSettingsSelectors } from '@osf/features/settings/profile-settings/profile-settings.selectors';
import { NameForm } from '@osf/features/settings/profile-settings/name/name.entities';
import { UpdateProfileSettingsUser } from '@osf/features/settings/profile-settings/profile-settings.actions';

@Component({
  selector: 'osf-name',
  imports: [Button, InputText, ReactiveFormsModule],
  templateUrl: './name.component.html',
  styleUrl: './name.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NameComponent {
  @HostBinding('class') classes = 'flex flex-column gap-4 flex-1';

  readonly #fb = inject(FormBuilder);
  readonly form = this.#fb.group<NameForm>({
    fullName: this.#fb.control('', { nonNullable: true }),
    givenName: this.#fb.control('', { nonNullable: true }),
    middleNames: this.#fb.control('', { nonNullable: true }),
    familyName: this.#fb.control('', { nonNullable: true }),
    suffix: this.#fb.control('', { nonNullable: true }),
  });
  readonly #store = inject(Store);
  readonly nameState = this.#store.selectSignal(ProfileSettingsSelectors.user);

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
    const { fullName, givenName, middleNames, familyName, suffix } =
      this.form.getRawValue();
    this.#store.dispatch(
      new UpdateProfileSettingsUser({
        user: {
          fullName,
          givenName,
          middleNames,
          familyName,
          suffix,
        },
      }),
    );
  }
}
