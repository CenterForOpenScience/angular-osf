import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { RadioButton } from 'primeng/radiobutton';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { LoadingSpinnerComponent } from '@osf/shared/components';
import { DEFAULT_SUPPORT_EMAIL } from '@osf/shared/constants';

import { PREPRINT_SETTINGS_SECTIONS } from '../../constants';
import { SettingsSectionControl } from '../../enums';
import { GetPreprintProvider, PreprintModerationSelectors } from '../../store/preprint-moderation';

@Component({
  selector: 'osf-preprint-moderation-settings',
  imports: [TranslatePipe, ReactiveFormsModule, Card, RadioButton, Message, LoadingSpinnerComponent],
  templateUrl: './preprint-moderation-settings.component.html',
  styleUrl: './preprint-moderation-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintModerationSettingsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  private readonly actions = createDispatchMap({ getPreprintProvider: GetPreprintProvider });
  readonly providerId = toSignal(this.route.parent?.params.pipe(map((params) => params['id'])) ?? of(undefined));

  settingsForm!: FormGroup;
  sections = PREPRINT_SETTINGS_SECTIONS;

  supportEmail = DEFAULT_SUPPORT_EMAIL;

  isLoading = select(PreprintModerationSelectors.arePreprintProviderLoading);

  settings = computed(() =>
    this.store.selectSignal(PreprintModerationSelectors.getPreprintProvider)()(this.providerId())
  );

  constructor() {
    effect(() => {
      if (this.settings()) {
        this.updateForm();
      }
    });
  }

  ngOnInit(): void {
    this.actions.getPreprintProvider(this.providerId());
    this.initForm();
  }

  private initForm(): void {
    this.settingsForm = this.fb.group({
      [SettingsSectionControl.ModerationType]: this.settings()?.reviewsWorkflow,
      [SettingsSectionControl.CommentVisibility]: this.settings()?.reviewsCommentsPrivate,
      [SettingsSectionControl.ModeratorComments]: this.settings()?.reviewsCommentsAnonymous,
    });

    this.settingsForm.disable();
  }

  private updateForm() {
    this.settingsForm.patchValue({
      [SettingsSectionControl.ModerationType]: this.settings()?.reviewsWorkflow,
      [SettingsSectionControl.CommentVisibility]: this.settings()?.reviewsCommentsPrivate,
      [SettingsSectionControl.ModeratorComments]: this.settings()?.reviewsCommentsAnonymous,
    });
  }
}
