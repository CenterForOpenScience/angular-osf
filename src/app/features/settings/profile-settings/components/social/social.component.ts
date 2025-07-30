import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, effect, HostBinding, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { UpdateProfileSettingsSocialLinks, UserSelectors } from '@osf/core/store/user';
import { Social } from '@osf/shared/models';
import { LoaderService, ToastService } from '@osf/shared/services';

import { socials } from '../../constants/data';
import { SOCIAL_KEYS, SocialLinksForm, SocialLinksKeys, UserSocialLink } from '../../models';
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

  protected readonly socials = socials;
  readonly userSocialLinks: UserSocialLink[] = [];

  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);

  readonly actions = createDispatchMap({ updateProfileSettingsSocialLinks: UpdateProfileSettingsSocialLinks });
  readonly socialLinks = select(UserSelectors.getSocialLinks);

  readonly fb = inject(FormBuilder);
  readonly socialLinksForm = this.fb.group({ links: this.fb.array<SocialLinksForm>([]) });

  constructor() {
    effect(() => {
      const socialLinks = this.socialLinks();

      this.links.clear();

      for (const socialLinksKey in socialLinks) {
        const socialLink = socialLinks[socialLinksKey as SocialLinksKeys];

        const socialLinkGroup = this.fb.group({
          socialOutput: [this.socials.find((social) => social.key === socialLinksKey), Validators.required],
          webAddress: [socialLink, Validators.required],
        });

        this.links.push(socialLinkGroup);
      }
    });
  }

  get links(): FormArray<FormGroup> {
    return this.socialLinksForm.get('links') as FormArray<FormGroup>;
  }

  addLink(): void {
    const linkGroup = this.fb.group({
      socialOutput: [this.socials[0], Validators.required],
      webAddress: ['', Validators.required],
    });

    this.links.push(linkGroup);
  }

  removeLink(index: number): void {
    this.links.removeAt(index);
  }

  saveSocialLinks(): void {
    const links = this.socialLinksForm.value.links as SocialLinksForm[];

    const mappedLinks = links.map((link) => {
      const key = link.socialOutput.key as SocialLinksKeys;

      const value = SOCIAL_KEYS.includes(key)
        ? Array.isArray(link.webAddress)
          ? link.webAddress
          : [link.webAddress]
        : link.webAddress;

      return {
        [key]: value,
      };
    }) satisfies Partial<Social>[];

    this.loaderService.show();

    this.actions.updateProfileSettingsSocialLinks({ socialLinks: mappedLinks }).subscribe(() => {
      this.loaderService.hide();
      this.toastService.showSuccess('settings.profileSettings.social.successUpdate');
    });
  }
}
