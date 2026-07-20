import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { Subject } from 'rxjs';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomDialogServiceMock, CustomDialogServiceMockType } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';

import { FileMetadataFields } from '../../constants';
import { OsfFileCustomMetadata } from '../../models/file-custom-metadata.model';
import { PatchFileMetadata } from '../../models/patch-file-metadata.model';
import { FilesSelectors, SetFileMetadata } from '../../store';

import { FileMetadataComponent } from './file-metadata.component';

describe('FileMetadataComponent', () => {
  let component: FileMetadataComponent;
  let fixture: ComponentFixture<FileMetadataComponent>;
  let customDialogService: CustomDialogServiceMockType;
  let store: Store;

  const mockFileMetadata: OsfFileCustomMetadata = {
    id: 'file-123',
    title: 'Test File',
    description: 'Test Description',
    resourceTypeGeneral: 'Dataset',
    language: 'en',
  };

  interface SetupOverrides extends BaseSetupOverrides {
    url?: string;
    dialogServiceMock?: CustomDialogServiceMockType;
  }

  function setup(options: SetupOverrides = {}) {
    customDialogService = options.dialogServiceMock ?? CustomDialogServiceMock.simple();
    const defaultSignals = [
      { selector: FilesSelectors.getFileCustomMetadata, value: mockFileMetadata },
      { selector: FilesSelectors.isFileMetadataLoading, value: false },
      { selector: FilesSelectors.hasWriteAccess, value: true },
    ];

    TestBed.configureTestingModule({
      imports: [FileMetadataComponent],
      providers: [
        provideOSFCore(),
        MockProvider(CustomDialogService, customDialogService),
        MockProvider(
          Router,
          RouterMockBuilder.create()
            .withUrl(options.url ?? '/test')
            .build()
        ),
        MockProvider(
          ActivatedRoute,
          ActivatedRouteMockBuilder.create()
            .withParams(options.routeParams ?? { fileGuid: 'test-guid' })
            .build()
        ),
        provideMockStore({ signals: mergeSignalOverrides(defaultSignals, options.selectorOverrides) }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(FileMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
    expect(component.metadataFields).toBe(FileMetadataFields);
  });

  it('should dispatch SetFileMetadata when file id exists', () => {
    setup();
    const formValues: PatchFileMetadata = {
      title: 'Updated Title',
      description: 'Updated Description',
      resource_type_general: 'Software',
      language: 'fr',
    };

    component.setFileMetadata(formValues);

    expect(store.dispatch).toHaveBeenCalledWith(new SetFileMetadata(formValues, mockFileMetadata.id));
  });

  it('should not dispatch SetFileMetadata when file id is missing', () => {
    setup({
      selectorOverrides: [{ selector: FilesSelectors.getFileCustomMetadata, value: { ...mockFileMetadata, id: '' } }],
    });

    (store.dispatch as Mock).mockClear();

    component.setFileMetadata({
      title: 'Updated',
      description: 'Description',
      resource_type_general: 'Software',
      language: 'fr',
    });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should open edit dialog', () => {
    setup();
    component.openEditFileMetadataDialog();

    expect(customDialogService.open).toHaveBeenCalledWith(expect.any(Function), {
      header: 'common.labels.edit',
      width: '448px',
      data: mockFileMetadata,
    });
  });

  it('should set hasViewOnly from url', () => {
    setup({ url: '/test?view_only=abc' });
    expect(component.hasViewOnly).toBe(true);
  });

  it('should open metadata url when file guid exists', () => {
    setup({ routeParams: { fileGuid: 'guid-123' } });
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);

    component.downloadFileMetadata();

    expect(openSpy).toHaveBeenCalledWith(expect.stringMatching(/\/metadata\/guid-123$/), '_blank');
  });

  it('should not open metadata url when file guid is missing', () => {
    setup({ routeParams: {} });
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);

    component.downloadFileMetadata();

    expect(openSpy).not.toHaveBeenCalled();
  });

  it('should call setFileMetadata when edit dialog closes with metadata', () => {
    const metadataChange$ = new Subject<PatchFileMetadata>();
    customDialogService = CustomDialogServiceMock.create()
      .withOpen(
        vi.fn().mockReturnValue({
          onClose: metadataChange$,
          close: vi.fn(),
        })
      )
      .build();
    setup({ dialogServiceMock: customDialogService });
    const setFileMetadataSpy = vi.spyOn(component, 'setFileMetadata');
    const formValues: PatchFileMetadata = {
      title: 'Edited',
      description: 'Edited desc',
      resource_type_general: 'Dataset',
      language: 'en',
    };

    component.openEditFileMetadataDialog();
    metadataChange$.next(formValues);

    expect(setFileMetadataSpy).toHaveBeenCalledWith(formValues);
  });

  it('should not call setFileMetadata when edit dialog closes with empty value', () => {
    const metadataChange$ = new Subject<PatchFileMetadata | null>();
    customDialogService = CustomDialogServiceMock.create()
      .withOpen(
        vi.fn().mockReturnValue({
          onClose: metadataChange$,
          close: vi.fn(),
        })
      )
      .build();
    setup({ dialogServiceMock: customDialogService });
    const setFileMetadataSpy = vi.spyOn(component, 'setFileMetadata');

    component.openEditFileMetadataDialog();
    metadataChange$.next(null);

    expect(setFileMetadataSpy).not.toHaveBeenCalled();
  });
});
