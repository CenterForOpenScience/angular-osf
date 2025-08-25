import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';

import { ENVIRONMENT } from '@core/constants/environment.token';

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
  readonly #translateService = inject(TranslateService);
  readonly #googlePicker = inject(GoogleFilePickerDownloadService);
  readonly #environment = inject(ENVIRONMENT);

  public isFolderPicker = input.required<boolean>();

  selectedFolderName = input<string>('');
  rootFolderId = input<string>('');

  //   selectFolder?: (a: Partial<Item>) => void;
  //   onRegisterChild?: (a: GoogleFilePickerWidget) => void;
  //   manager: StorageManager;
  //   accountId: string;
  //     @tracked openGoogleFilePicker = false;
  #folderName = signal<string>('');
  selectFolder = undefined;
  accessToken!: string;

  public visible = signal(false);
  public isGFPDisabled = signal(true);
  readonly #apiKey = this.#environment.google.GOOGLE_FILE_PICKER_API_KEY;
  readonly #appId = this.#environment.google.GOOGLE_FILE_PICKER_APP_ID;
  #mimeTypes = '';
  #parentId = '';
  #isMultipleSelect!: boolean;
  #title!: string;

  ngOnInit(): void {
    //         window.GoogleFilePickerWidget = this;
    // this.selectFolder = this.selectFolder();
    // taskFor(this.loadOauthToken).perform();
    this.#mimeTypes = this.isFolderPicker() ? 'application/vnd.google-apps.folder' : '';
    this.#parentId = this.isFolderPicker() ? '' : this.rootFolderId();
    this.#title = this.isFolderPicker()
      ? this.#translateService.instant('settings.addons.configureAddon.google-file-picker.root-folder-title')
      : this.#translateService.instant('settings.addons.configureAddon.google-file-picker.file-folder-title');
    this.#isMultipleSelect = !this.isFolderPicker();
    this.#folderName.set(this.selectedFolderName());

    this.#googlePicker.loadScript().subscribe({
      next: () => {
        this.#googlePicker.loadGapiModules().subscribe({
          next: () => this.initializePicker(),
          // TODO add this error when the Sentry service is working
          //error: (err) => console.error('GAPI modules failed:', err),
        });
      },
      // TODO add this error when the Sentry service is working
      // error: (err) => console.error('Script load failed:', err),
    });
  }

  public initializePicker() {
    if (this.isFolderPicker()) {
      this.visible.set(true);
      this.isGFPDisabled.set(false);
    }
  }

  createPicker(): void {
    const google = window.google;

    const googlePickerView = new google.picker.DocsView(google.picker.ViewId.DOCS);
    googlePickerView.setSelectFolderEnabled(true);
    googlePickerView.setMimeTypes(this.#mimeTypes);
    googlePickerView.setIncludeFolders(true);
    googlePickerView.setParent(this.#parentId);

    const pickerBuilder = new google.picker.PickerBuilder()
      .setDeveloperKey(this.#apiKey)
      .setAppId(this.#appId)
      .addView(googlePickerView)
      .setTitle(this.#title)
      .setOAuthToken(this.accessToken)
      .setCallback(this.pickerCallback.bind(this));

    if (this.#isMultipleSelect) {
      pickerBuilder.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
    }

    const picker = pickerBuilder.build();
    picker.setVisible(true);
  }

  //     /**
  //     * Displays the file details of the user's selection.
  //     * @param {object} data - Containers the user selection from the picker
  //     */
  // eslint-disable-next-line
  async pickerCallback(data: any) {
    //     async pickerCallback(data: any) {
    //         if (data.action === window.google.picker.Action.PICKED) {
    //             this.filePickerCallback(data.docs[0]);
    //         }
    //     }
    console.log('data');
  }
}

// //
// // 📚 Interface for Expected Arguments
// //
// interface Args {
//   /**
//    * selectFolder
//    *
//    * @description
//    * A callback function passed into the component
//    * that accepts a partial Item object and handles it (e.g., selects a file).
//    */
//   selectFolder?: (a: Partial<Item>) => void;
//   onRegisterChild?: (a: GoogleFilePickerWidget) => void;
//   selectedFolderName?: string;
//   isFolderPicker: boolean;
//   rootFolderId: string;
//   manager: StorageManager;
//   accountId: string;
// }

//     @task
//     @waitFor
//     private async loadOauthToken(): Promise<void>{
//         if (this.args.accountId) {
//             const authorizedStorageAccount = await this.store.
//                 findRecord('authorized-storage-account', this.args.accountId);
//             authorizedStorageAccount.serializeOauthToken = true;
//             const token = await authorizedStorageAccount.save();
//             this.accessToken = token.oauthToken;
//             this.isGFPDisabled = this.accessToken ? false : true;
//         }
//     }

//     /**
//      * filePickerCallback
//      *
//      * @description
//      * Action triggered when a file is selected via an external picker.
//      * Logs the file data and notifies the parent system by calling `selectFolder`.
//      *
//      * @param file - The file object selected (format determined by external API)
//      */
//     @action
//     filePickerCallback(data: any) {
//         if (this.selectFolder !== undefined) {
//             this.folderName = data.name;
//             this.selectFolder({
//                 itemName: data.name,
//                 itemId: data.id,
//             });
//         } else {
//             this.args.manager.reload();
//         }
//     }

//     @action
//     registerComponent() {
//         if (this.args.onRegisterChild) {
//             this.args.onRegisterChild(this); // Pass the child's instance to the parent
//         }
//     }

//     willDestroy() {
//         super.willDestroy();
//         this.pickerInited = false;
//     }

//     /**
//     * Displays the file details of the user's selection.
//     * @param {object} data - Containers the user selection from the picker
//     */
//     async pickerCallback(data: any) {
//         if (data.action === window.google.picker.Action.PICKED) {
//             this.filePickerCallback(data.docs[0]);
//         }
//     }
// }
