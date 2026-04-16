import { Observable, of } from 'rxjs';

import { Mock } from 'vitest';

import { GoogleFilePickerDownloadService } from '@shared/services/google-file-picker.download.service';

type VoidObservableFn = () => Observable<void>;

export type GoogleFilePickerDownloadServiceMockType = Partial<GoogleFilePickerDownloadService> & {
  loadScript: Mock<VoidObservableFn>;
  loadGapiModules: Mock<VoidObservableFn>;
};

export class GoogleFilePickerDownloadServiceMockBuilder {
  private loadScriptMock: Mock<VoidObservableFn> = vi.fn<VoidObservableFn>().mockReturnValue(of(void 0));
  private loadGapiModulesMock: Mock<VoidObservableFn> = vi.fn<VoidObservableFn>().mockReturnValue(of(void 0));

  static create(): GoogleFilePickerDownloadServiceMockBuilder {
    return new GoogleFilePickerDownloadServiceMockBuilder();
  }

  withLoadScript(mockImpl: Mock<VoidObservableFn>): GoogleFilePickerDownloadServiceMockBuilder {
    this.loadScriptMock = mockImpl;
    return this;
  }

  withLoadGapiModules(mockImpl: Mock<VoidObservableFn>): GoogleFilePickerDownloadServiceMockBuilder {
    this.loadGapiModulesMock = mockImpl;
    return this;
  }

  build(): GoogleFilePickerDownloadServiceMockType {
    return {
      loadScript: this.loadScriptMock,
      loadGapiModules: this.loadGapiModulesMock,
    } as GoogleFilePickerDownloadServiceMockType;
  }
}

export const GoogleFilePickerDownloadServiceMock = {
  create() {
    return GoogleFilePickerDownloadServiceMockBuilder.create();
  },
  simple() {
    return GoogleFilePickerDownloadServiceMockBuilder.create().build();
  },
};
