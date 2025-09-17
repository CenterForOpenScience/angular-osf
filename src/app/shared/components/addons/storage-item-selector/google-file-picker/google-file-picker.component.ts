import { Store } from '@ngxs/store';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';

import { SENTRY_TOKEN } from '@core/factory/sentry.factory';
import { OSFConfigService } from '@core/services/osf-config.service';
import { StorageItemModel } from '@osf/shared/models';
import { GoogleFileDataModel } from '@osf/shared/models/files/google-file.data.model';
import { GoogleFilePickerModel } from '@osf/shared/models/files/google-file.picker.model';
import { AddonsSelectors, GetAuthorizedStorageOauthToken } from '@osf/shared/stores';
import { AddonType } from '@shared/enums';

import { GoogleFilePickerDownloadService } from './service/google-file-picker.download.service';

@Component({
  selector: 'osf-google-file-picker',
  imports: [TranslateModule, Button],
  templateUrl: './google-file-picker.component.html',
  styleUrl: './google-file-picker.component.scss',
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleFilePickerComponent implements OnInit {
  private readonly Sentry = inject(SENTRY_TOKEN);
  private configService = inject(OSFConfigService);
  readonly #translateService = inject(TranslateService);
  readonly #googlePicker = inject(GoogleFilePickerDownloadService);

  public isFolderPicker = input.required<boolean>();
  public rootFolder = input<StorageItemModel | null>(null);
  public accountId = input<string>('');
  public handleFolderSelection = input<(folder: StorageItemModel) => void>();
  currentAddonType = input<string>(AddonType.STORAGE);

  public accessToken = signal<string | null>(null);
  public visible = signal(false);
  public isGFPDisabled = signal(true);
  private readonly apiKey = this.configService.get('googleFilePickerApiKey');
  private readonly appId = this.configService.get('googleFilePickerAppId');

  private readonly store = inject(Store);
  private parentId = '';
  private isMultipleSelect!: boolean;
  private title!: string;

  private get isPickerConfigured() {
    return !!this.apiKey && !!this.appId;
  }

  ngOnInit(): void {
    if (!this.isPickerConfigured) {
      this.isGFPDisabled.set(true);
      return;
    }

    this.parentId = this.isFolderPicker() ? '' : this.rootFolder()?.itemId || '';
    this.title = this.isFolderPicker()
      ? this.#translateService.instant('settings.addons.configureAddon.google-file-picker.root-folder-title')
      : this.#translateService.instant('settings.addons.configureAddon.google-file-picker.file-folder-title');
    this.isMultipleSelect = !this.isFolderPicker();

    this.#googlePicker.loadScript().subscribe({
      next: () => {
        this.#googlePicker.loadGapiModules().subscribe({
          next: () => {
            this.#initializePicker();
            this.#loadOauthToken();
          },
          error: (err) => this.Sentry.captureException(err, { tags: { feature: 'google-picker auth' } }),
        });
      },
      error: (err) => this.Sentry.captureException(err, { tags: { feature: 'google-picker load' } }),
    });
  }

  #initializePicker() {
    if (this.isFolderPicker()) {
      this.visible.set(true);
    }
  }

  public createPicker(): void {
    if (!this.isPickerConfigured) return;
    const google = window.google;

    const googlePickerView = new google.picker.DocsView(google.picker.ViewId.DOCS);
    googlePickerView.setSelectFolderEnabled(true);
    if (this.isFolderPicker()) {
      googlePickerView.setMimeTypes('application/vnd.google-apps.folder');
    }
    googlePickerView.setIncludeFolders(true);
    googlePickerView.setParent(this.parentId);

    const pickerBuilder = new google.picker.PickerBuilder()
      .setDeveloperKey(this.apiKey)
      .setAppId(this.appId)
      .addView(googlePickerView)
      .setTitle(this.title)
      .setOAuthToken(this.accessToken())
      .setCallback(this.pickerCallback.bind(this));

    if (this.isMultipleSelect) {
      pickerBuilder.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
    }

    const picker = pickerBuilder.build();
    picker.setVisible(true);
  }

  #loadOauthToken(): void {
    if (this.accountId()) {
      this.store.dispatch(new GetAuthorizedStorageOauthToken(this.accountId(), this.currentAddonType())).subscribe({
        next: () => {
          this.accessToken.set(
            this.store.selectSnapshot(AddonsSelectors.getAuthorizedStorageAddonOauthToken(this.accountId()))
          );
          this.isGFPDisabled.set(!this.accessToken());
        },
      });
    }
  }

  #filePickerCallback(data: GoogleFileDataModel) {
    this.handleFolderSelection()?.(
      Object({
        itemName: data.name,
        itemId: data.id,
      })
    );
  }

  pickerCallback(data: GoogleFilePickerModel) {
    if (data.action === window.google.picker.Action.PICKED) {
      this.#filePickerCallback(data.docs[0]);
    }
  }
}
