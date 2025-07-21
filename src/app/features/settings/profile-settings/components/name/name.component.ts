import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, HostBinding, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';

import { User } from '@osf/core/models';
import { LoaderService, ToastService } from '@osf/shared/services';
import { CustomValidators } from '@osf/shared/utils';

import { NameForm } from '../../models';
import { ProfileSettingsSelectors, UpdateProfileSettingsUser } from '../../store';
import { CitationPreviewComponent } from '../citation-preview/citation-preview.component';
import { NameFormComponent } from '../name-form/name-form.component';

@Component({
  selector: 'osf-name',
  imports: [Button, TranslatePipe, CitationPreviewComponent, NameFormComponent],
  templateUrl: './name.component.html',
  styleUrl: './name.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NameComponent {
  @HostBinding('class') classes = 'flex flex-column gap-4 flex-1';

  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly actions = createDispatchMap({ updateProfileSettingsUser: UpdateProfileSettingsUser });
  readonly currentUser = select(ProfileSettingsSelectors.user);
  readonly previewUser = signal<Partial<User>>({});

  readonly fb = inject(FormBuilder);
  readonly form = this.fb.group<NameForm>({
    fullName: this.fb.control('', { nonNullable: true, validators: [CustomValidators.requiredTrimmed()] }),
    givenName: this.fb.control('', { nonNullable: true }),
    middleNames: this.fb.control('', { nonNullable: true }),
    familyName: this.fb.control('', { nonNullable: true }),
    suffix: this.fb.control('', { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const user = this.currentUser();
      this.updateForm(user);
      this.updatePreviewUser();
    });

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updatePreviewUser();
    });
  }

  saveChanges() {
    if (this.form.invalid) {
      return;
    }

    const { fullName, givenName, middleNames, familyName, suffix } = this.form.getRawValue();

    this.loaderService.show();
    this.actions
      .updateProfileSettingsUser({
        user: {
          fullName,
          givenName,
          middleNames,
          familyName,
          suffix,
        },
      })
      .subscribe(() => {
        this.loaderService.hide();
        this.toastService.showSuccess('settings.profileSettings.name.successUpdate');
      });
  }

  discardChanges() {
    const user = this.currentUser();
    this.updateForm(user);
  }

  private updateForm(user: Partial<User>) {
    this.form.patchValue({
      fullName: user.fullName,
      givenName: user.givenName,
      middleNames: user.middleNames,
      familyName: user.familyName,
      suffix: user.suffix,
    });
  }

  private updatePreviewUser() {
    const formValues = this.form.getRawValue();
    const currentUserValue = this.currentUser();

    this.previewUser.set({
      ...currentUserValue,
      ...formValues,
    });
  }
}
