import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  HostBinding,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { UpdateProfileSettingsSocialLinks, UserSelectors } from '@osf/core/store/user';
import { Social } from '@osf/shared/models';
import { CustomConfirmationService, LoaderService, ToastService } from '@osf/shared/services';

import { SOCIALS } from '../../constants/socials';
import { hasSocialLinkChanges, mapSocialLinkToPayload } from '../../helpers';
import { SocialLinksForm } from '../../models';
import { SocialFormComponent } from '../social-form/social-form.component';

@Component({
  selector: 'osf-social',
  imports: [Button, ReactiveFormsModule, SocialFormComponent, TranslatePipe],
  templateUrl: './social.component.html',
  styleUrl: './social.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialComponent {
  @HostBinding('class') class = 'flex flex-column gap-5';

  private readonly loaderService = inject(LoaderService);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);

  private readonly socials = SOCIALS;

  readonly actions = createDispatchMap({ updateProfileSettingsSocialLinks: UpdateProfileSettingsSocialLinks });
  readonly socialLinks = select(UserSelectors.getSocialLinks);

  readonly socialLinksForm = this.fb.group({ links: this.fb.array<SocialLinksForm>([]) });

  constructor() {
    effect(() => this.setInitialData());
  }

  get links(): FormArray<FormGroup> {
    return this.socialLinksForm.get('links') as FormArray<FormGroup>;
  }

  discardChanges(): void {
    if (!this.hasFormChanges()) {
      return;
    }

    this.customConfirmationService.confirmDelete({
      headerKey: 'common.discardChangesDialog.header',
      messageKey: 'common.discardChangesDialog.message',
      acceptLabelKey: 'common.buttons.discardChanges',
      onConfirm: () => {
        this.setInitialData();
        this.toastService.showSuccess('settings.profileSettings.changesDiscarded');
      },
    });
  }

  saveSocialLinks(): void {
    if (this.socialLinksForm.invalid) {
      this.socialLinksForm.markAllAsTouched();
      return;
    }

    const links = this.socialLinksForm.value.links as SocialLinksForm[];
    const mappedLinks = links.map((link) => mapSocialLinkToPayload(link)) satisfies Partial<Social>[];

    this.loaderService.show();
    this.actions
      .updateProfileSettingsSocialLinks(mappedLinks)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loaderService.hide();
          this.toastService.showSuccess('settings.profileSettings.social.successUpdate');
        },
        error: () => this.loaderService.hide(),
      });
  }

  hasFormChanges(): boolean {
    const currentLinks = this.socialLinksForm.value.links as SocialLinksForm[];
    const initialSocialLinks = this.socialLinks();

    if (!initialSocialLinks || !currentLinks) return false;

    return currentLinks.some((link, index) => hasSocialLinkChanges(link, initialSocialLinks, index, this.socials));
  }

  private setInitialData(): void {
    const socialLinks = this.socialLinks();
    this.links.clear();

    this.socials.forEach((social) => {
      const key = social.key;
      const socialLink = socialLinks?.[key] ?? '';
      const linkedKey = social.linkedField?.key;
      const linkedValue = linkedKey ? (socialLinks?.[linkedKey] ?? '') : '';
      const socialLinkGroup = this.fb.group({
        socialOutput: [social],
        webAddress: [socialLink],
        linkedWebAddress: [linkedValue],
      });

      this.links.push(socialLinkGroup);
    });

    this.cd.markForCheck();
  }
}
