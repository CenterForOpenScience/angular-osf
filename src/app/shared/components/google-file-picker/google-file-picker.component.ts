import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { catchError, EMPTY, switchMap } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { SENTRY_TOKEN } from '@core/provider/sentry.provider';
import { AddonType } from '@osf/shared/enums/addon-type.enum';
import { GoogleFilePickerDownloadService } from '@osf/shared/services/google-file-picker.download.service';
import { StorageItem } from '@shared/models/addons/storage-item.model';
import { GoogleFilePickerModel } from '@shared/models/files/google-file-picker.model';
import { AddonsSelectors, GetAuthorizedStorageOauthToken } from '@shared/stores/addons';

@Component({
  selector: 'osf-google-file-picker',
  imports: [TranslatePipe, Button],
  templateUrl: './google-file-picker.component.html',
  styleUrl: './google-file-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleFilePickerComponent implements OnInit {
  private readonly Sentry = inject(SENTRY_TOKEN);
  private readonly destroyRef = inject(DestroyRef);
  private readonly environment = inject(ENVIRONMENT);
  private readonly translateService = inject(TranslateService);
  private readonly googlePicker = inject(GoogleFilePickerDownloadService);
  private readonly apiKey = this.environment.googleFilePickerApiKey;
  private readonly appId = this.environment.googleFilePickerAppId;
  private readonly isPickerConfigured = !!this.apiKey && !!this.appId;

  private readonly authorizedStorageAddons = select(AddonsSelectors.getAuthorizedStorageAddons);
  private readonly actions = createDispatchMap({
    getAuthorizedStorageOauthToken: GetAuthorizedStorageOauthToken,
  });

  readonly isFolderPicker = input.required<boolean>();
  readonly rootFolder = input<StorageItem | null>(null);
  readonly accountId = input<string>('');
  readonly handleFolderSelection = input<(folder: StorageItem) => void>();
  readonly currentAddonType = input<string>(AddonType.STORAGE);

  private readonly scriptsLoaded = signal(false);

  private readonly accessToken = computed(() => {
    const accountId = this.accountId();
    return this.authorizedStorageAddons()?.find((addon) => addon.id === accountId)?.oauthToken || null;
  });

  readonly visible = computed(() => this.isFolderPicker() && this.scriptsLoaded());
  readonly isGFPDisabled = computed(() => !this.isPickerConfigured || !this.scriptsLoaded() || !this.accessToken());

  constructor() {
    effect(() => {
      if (!this.isPickerConfigured || !this.accountId()) {
        return;
      }

      this.loadOauthToken();
    });
  }

  ngOnInit(): void {
    if (!this.isPickerConfigured) {
      return;
    }

    this.googlePicker
      .loadScript()
      .pipe(
        catchError((err) => {
          this.Sentry.captureException(err, { tags: { feature: 'google-picker load' } });
          return EMPTY;
        }),
        switchMap(() => this.googlePicker.loadGapiModules()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => this.scriptsLoaded.set(true),
        error: (err) => this.Sentry.captureException(err, { tags: { feature: 'google-picker auth' } }),
      });
  }

  createPicker(): void {
    if (this.isGFPDisabled()) {
      return;
    }

    this.refreshOauthTokenAndOpenPicker();
  }

  private refreshOauthTokenAndOpenPicker(): void {
    this.actions
      .getAuthorizedStorageOauthToken(this.accountId(), this.currentAddonType())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => this.openPickerWithCurrentToken(),
        error: () => undefined,
      });
  }

  private openPickerWithCurrentToken(): void {
    const google = window.google;
    if (!google?.picker) {
      return;
    }

    const isFolderPicker = this.isFolderPicker();
    const titleKey = isFolderPicker
      ? 'settings.addons.configureAddon.googleFilePicker.rootFolderTitle'
      : 'settings.addons.configureAddon.googleFilePicker.fileFolderTitle';

    const googlePickerView = new google.picker.DocsView(google.picker.ViewId.DOCS);
    googlePickerView.setSelectFolderEnabled(true);
    if (isFolderPicker) {
      googlePickerView.setMimeTypes('application/vnd.google-apps.folder');
    }
    googlePickerView.setIncludeFolders(true);
    googlePickerView.setParent(isFolderPicker ? '' : this.rootFolder()?.itemId || '');

    const pickerBuilder = new google.picker.PickerBuilder()
      .setDeveloperKey(this.apiKey)
      .setAppId(String(this.appId))
      .addView(googlePickerView)
      .setTitle(this.translateService.instant(titleKey))
      .setOAuthToken(this.accessToken())
      .setCallback(this.pickerCallback.bind(this));

    if (!isFolderPicker) {
      pickerBuilder.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
    }

    const picker = pickerBuilder.build();
    picker.setVisible(true);
  }

  private loadOauthToken(): void {
    this.actions.getAuthorizedStorageOauthToken(this.accountId(), this.currentAddonType());
  }

  private pickerCallback(data: GoogleFilePickerModel) {
    if (data.action !== window.google.picker.Action.PICKED) {
      return;
    }

    const handleFolderSelection = this.handleFolderSelection();
    for (const selectedFile of data.docs ?? []) {
      handleFolderSelection?.({
        itemName: selectedFile.name,
        itemId: String(selectedFile.id),
      });
    }
  }
}
