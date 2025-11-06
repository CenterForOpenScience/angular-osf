import { Store } from '@ngxs/store';

import { Observable, of, throwError } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SENTRY_TOKEN } from '@core/provider/sentry.provider';
import { GoogleFilePickerDownloadService } from '@osf/shared/services/google-file-picker.download.service';

import { GoogleFilePickerComponent } from './google-file-picker.component';

import { OSFTestingModule, OSFTestingStoreModule } from '@testing/osf.testing.module';

describe('Component: Google File Picker', () => {
  let component: GoogleFilePickerComponent;
  let fixture: ComponentFixture<GoogleFilePickerComponent>;

  const googlePickerServiceSpy = {
    loadScript: jest.fn((): Observable<void> => {
      return throwLoadScriptError ? throwError(() => new Error('loadScript failed')) : of(void 0);
    }),
    loadGapiModules: jest.fn((): Observable<void> => {
      return throwLoadGapiError ? throwError(() => new Error('loadGapiModules failed')) : of(void 0);
    }),
  };

  let sentrySpy: any;

  let throwLoadScriptError = false;
  let throwLoadGapiError = false;

  const handleFolderSelection = jest.fn();
  const setDeveloperKey = jest.fn().mockReturnThis();
  const setAppId = jest.fn().mockReturnThis();
  const addView = jest.fn().mockReturnThis();
  const setTitle = jest.fn().mockReturnThis();
  const setOAuthToken = jest.fn().mockReturnThis();
  const setCallback = jest.fn().mockReturnThis();
  const enableFeature = jest.fn().mockReturnThis();
  const setVisible = jest.fn();
  const build = jest.fn().mockReturnValue({
    setVisible,
  });

  const setSelectFolderEnabled = jest.fn();
  const setMimeTypes = jest.fn();
  const setIncludeFolders = jest.fn();
  const setParent = jest.fn();

  const storeMock = {
    dispatch: jest.fn().mockReturnValue(of({})),
    selectSnapshot: jest.fn().mockReturnValue('mock-token'),
  };

  beforeEach(() => {
    throwLoadScriptError = false;
    throwLoadGapiError = false;
    jest.clearAllMocks();
  });

  beforeAll(() => {
    throwLoadScriptError = false;
    throwLoadGapiError = false;

    window.google = {
      picker: {
        Action: null,
      },
    };
  });

  afterAll(() => {
    delete (window as any).google;
  });

  describe('isFolderPicker - true', () => {
    beforeEach(async () => {
      (window as any).google = {
        picker: {
          ViewId: {
            DOCS: 'docs',
          },
          DocsView: jest.fn().mockImplementation(() => ({
            setSelectFolderEnabled,
            setMimeTypes,
            setIncludeFolders,
            setParent,
          })),
          PickerBuilder: jest.fn().mockImplementation(() => ({
            setDeveloperKey,
            setAppId,
            addView,
            setTitle,
            setOAuthToken,
            setCallback,
            enableFeature,
            build,
          })),
          Feature: {
            MULTISELECT_ENABLED: 'multiselect',
          },
        },
      };

      await TestBed.configureTestingModule({
        imports: [OSFTestingModule, GoogleFilePickerComponent],
        providers: [
          { provide: SENTRY_TOKEN, useValue: { captureException: jest.fn() } },
          { provide: GoogleFilePickerDownloadService, useValue: googlePickerServiceSpy },
          {
            provide: Store,
            useValue: storeMock,
          },
        ],
      }).compileComponents();

      sentrySpy = TestBed.inject(SENTRY_TOKEN);
      jest.spyOn(sentrySpy, 'captureException');

      fixture = TestBed.createComponent(GoogleFilePickerComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('isFolderPicker', true);
      fixture.componentRef.setInput('rootFolder', {
        itemId: 'root-folder-id',
      });
      fixture.componentRef.setInput('handleFolderSelection', handleFolderSelection);
      fixture.componentRef.setInput('accountId', 'account-id');
      fixture.detectChanges();
    });

    it('should load script and then GAPI modules and initialize picker', () => {
      expect(googlePickerServiceSpy.loadScript).toHaveBeenCalled();
      expect(googlePickerServiceSpy.loadGapiModules).toHaveBeenCalled();
      expect(sentrySpy.captureException).not.toHaveBeenCalled();

      expect(component.visible()).toBeTruthy();
      expect(component.isGFPDisabled()).toBeFalsy();
    });

    it('should build the picker with correct configuration', () => {
      component.createPicker();

      expect(window.google.picker.DocsView).toHaveBeenCalledWith('docs');
      expect(setSelectFolderEnabled).toHaveBeenCalledWith(true);
      expect(setMimeTypes).toHaveBeenCalledWith('application/vnd.google-apps.folder');
      expect(setIncludeFolders).toHaveBeenCalledWith(true);
      expect(setParent).toHaveBeenCalledWith('');

      expect(window.google.picker.PickerBuilder).toHaveBeenCalledWith();
      expect(setDeveloperKey).toHaveBeenCalledWith('test-api-key');
      expect(setAppId).toHaveBeenCalledWith('test-app-id');
      expect(addView).toHaveBeenCalled();
      expect(setTitle).toHaveBeenCalledWith('settings.addons.configureAddon.google-file-picker.root-folder-title');
      expect(setOAuthToken).toHaveBeenCalledWith('mock-token');
      expect(setCallback).toHaveBeenCalled();
      expect(enableFeature).not.toHaveBeenCalled();
      expect(build).toHaveBeenCalledWith();
      expect(setVisible).toHaveBeenCalledWith(true);
    });

    describe('pickerCallback', () => {
      it('should handle a folder selection `PICKED` action', () => {
        window.google.picker.Action = {
          PICKED: 'PICKED',
        };
        component.pickerCallback(
          Object({
            action: 'PICKED',
            docs: [
              Object({
                itemId: 'item id',
                itemName: 'item name',
              }),
            ],
          })
        );

        expect(handleFolderSelection).toHaveBeenCalledWith(Object({}));
      });

      it('should handle a folder selection not `PICKED` action', () => {
        window.google.picker.Action = {
          PICKED: 'not picked',
        };

        component.pickerCallback(
          Object({
            action: 'Loading',
          })
        );

        expect(handleFolderSelection).not.toHaveBeenCalled();
      });
    });
  });

  describe('isFolderPicker - false', () => {
    beforeEach(async () => {
      (window as any).google = {
        picker: {
          ViewId: {
            DOCS: 'docs',
          },
          DocsView: jest.fn().mockImplementation(() => ({
            setSelectFolderEnabled,
            setMimeTypes,
            setIncludeFolders,
            setParent,
          })),
          PickerBuilder: jest.fn().mockImplementation(() => ({
            setDeveloperKey,
            setAppId,
            addView,
            setTitle,
            setOAuthToken,
            setCallback,
            enableFeature,
            build,
          })),
          Feature: {
            MULTISELECT_ENABLED: 'multiselect',
          },
        },
      };

      await TestBed.configureTestingModule({
        imports: [OSFTestingStoreModule, GoogleFilePickerComponent],
        providers: [
          { provide: SENTRY_TOKEN, useValue: { captureException: jest.fn() } },
          { provide: GoogleFilePickerDownloadService, useValue: googlePickerServiceSpy },
          {
            provide: Store,
            useValue: storeMock,
          },
        ],
      }).compileComponents();

      sentrySpy = TestBed.inject(SENTRY_TOKEN);
      jest.spyOn(sentrySpy, 'captureException');

      fixture = TestBed.createComponent(GoogleFilePickerComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('isFolderPicker', false);
      fixture.componentRef.setInput('rootFolder', {
        itemId: 'root-folder-id',
      });
      fixture.componentRef.setInput('handleFolderSelection', jest.fn());
    });

    it('should fail to load script', () => {
      throwLoadScriptError = true;
      fixture.detectChanges();
      expect(googlePickerServiceSpy.loadScript).toHaveBeenCalled();
      expect(sentrySpy.captureException).toHaveBeenCalledWith(Error('loadScript failed'), {
        tags: {
          feature: 'google-picker load',
        },
      });

      expect(component.visible()).toBeFalsy();
      expect(component.isGFPDisabled()).toBeTruthy();
    });

    it('should load script and then failr GAPI modules', () => {
      throwLoadGapiError = true;
      fixture.detectChanges();
      expect(googlePickerServiceSpy.loadScript).toHaveBeenCalled();
      expect(googlePickerServiceSpy.loadGapiModules).toHaveBeenCalled();
      expect(sentrySpy.captureException).toHaveBeenCalledWith(Error('loadGapiModules failed'), {
        tags: {
          feature: 'google-picker auth',
        },
      });
      expect(component.visible()).toBeFalsy();
      expect(component.isGFPDisabled()).toBeTruthy();
    });

    it('should build the picker with correct configuration', () => {
      fixture.detectChanges();
      component.createPicker();

      expect(window.google.picker.DocsView).toHaveBeenCalledWith('docs');
      expect(setSelectFolderEnabled).toHaveBeenCalledWith(true);
      expect(setMimeTypes).not.toHaveBeenCalled();
      expect(setIncludeFolders).toHaveBeenCalledWith(true);
      expect(setParent).toHaveBeenCalledWith('root-folder-id');

      expect(window.google.picker.PickerBuilder).toHaveBeenCalledWith();
      expect(setDeveloperKey).toHaveBeenCalledWith('test-api-key');
      expect(setAppId).toHaveBeenCalledWith('test-app-id');
      expect(addView).toHaveBeenCalled();
      expect(setTitle).toHaveBeenCalledWith('settings.addons.configureAddon.google-file-picker.file-folder-title');
      expect(setOAuthToken).toHaveBeenCalledWith(null);
      expect(setCallback).toHaveBeenCalled();
      expect(enableFeature).toHaveBeenCalledWith('multiselect');
      expect(build).toHaveBeenCalledWith();
      expect(setVisible).toHaveBeenCalledWith(true);
    });
  });
});
