import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { FileProvider } from '@osf/features/files/constants';
import { FileMenuComponent } from '@osf/shared/components/file-menu/file-menu.component';
import { FilesDropZoneComponent } from '@osf/shared/components/files-drop-zone/files-drop-zone.component';
import { FilesTreeRowComponent } from '@osf/shared/components/files-tree-row/files-tree-row.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { FileKind } from '@osf/shared/enums/file-kind.enum';
import { FileMenuType } from '@osf/shared/enums/file-menu-type.enum';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { FileLabelModel } from '@osf/shared/models/files/file-label.model';
import { FileDownloadService } from '@osf/shared/services/file-download.service';
import { FilesShareEmbedService } from '@osf/shared/services/files-share-embed.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { FileModelMock } from '@testing/mocks/file.model.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { FileDownloadServiceMock, FileDownloadServiceMockType } from '@testing/providers/file-download-service.mock';
import {
  FilesShareEmbedServiceMock,
  FilesShareEmbedServiceMockType,
} from '@testing/providers/files-share-embed-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { ViewOnlyLinkHelperMock, ViewOnlyLinkHelperMockType } from '@testing/providers/view-only-link-helper.mock';

import { MoveCopyAction } from '../../enums/move-copy-action.enum';

import { FilesTreeExplorerComponent } from './files-tree-explorer.component';

describe('FilesTreeExplorerComponent', () => {
  let component: FilesTreeExplorerComponent;
  let fixture: ComponentFixture<FilesTreeExplorerComponent>;
  let routerMock: RouterMockType;
  let fileDownloadService: FileDownloadServiceMockType;
  let filesShareEmbedService: FilesShareEmbedServiceMockType;
  let viewOnlyHelper: ViewOnlyLinkHelperMockType;

  const currentFolder: FileFolderModel = {
    id: 'folder-1',
    kind: FileKind.Folder,
    name: 'Folder 1',
    node: 'node-1',
    path: '/folder-1',
    provider: FileProvider.OsfStorage,
    links: {
      newFolder: '/new-folder',
      storageAddons: '/storage-addons',
      upload: '/upload',
      filesLink: '/files-link',
      download: '/download',
    },
  };

  const storage: FileLabelModel = { label: 'OSF Storage', folder: currentFolder };

  function setup() {
    routerMock = RouterMockBuilder.create().withUrl('/node-1/files').build();
    fileDownloadService = FileDownloadServiceMock.simple();
    viewOnlyHelper = ViewOnlyLinkHelperMock.simple(false);
    filesShareEmbedService = FilesShareEmbedServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [
        FilesTreeExplorerComponent,
        ...MockComponents(LoadingSpinnerComponent, FilesDropZoneComponent, FilesTreeRowComponent, FileMenuComponent),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(Router, routerMock),
        MockProvider(FileDownloadService, fileDownloadService),
        MockProvider(FilesShareEmbedService, filesShareEmbedService),
        MockProvider(ViewOnlyLinkHelperService, viewOnlyHelper),
      ],
    });

    fixture = TestBed.createComponent(FilesTreeExplorerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('files', []);
    fixture.componentRef.setInput('currentFolder', currentFolder);
    fixture.componentRef.setInput('storage', storage);
    fixture.componentRef.setInput('resourceId', 'node-1');
    fixture.componentRef.setInput('resourceType', CurrentResourceType.Projects);
    fixture.componentRef.setInput('totalCount', 0);
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should emit dropped files', () => {
    setup();
    const emitSpy = vi.spyOn(component.uploadFiles, 'emit');
    const dropped = [new File(['a'], 'a.txt')];

    component.onDropFiles(dropped);

    expect(emitSpy).toHaveBeenCalledWith(dropped);
  });

  it('should open file entry and emit fileOpened', () => {
    setup();
    const file = FileModelMock.simple({ id: 'f1', kind: FileKind.File });
    const emitSpy = vi.spyOn(component.fileOpened, 'emit');

    component.openEntry(file);

    expect(emitSpy).toHaveBeenCalledWith(file);
  });

  it('should open folder entry and emit currentFolderChanged', () => {
    setup();
    const folderFile = FileModelMock.simple({
      id: 'sub',
      kind: FileKind.Folder,
      name: 'Sub',
      path: '/folder-1/sub',
      provider: FileProvider.OsfStorage,
      filesLink: '/sub-files',
      links: { ...FileModelMock.simple().links, upload: '/sub-upload' },
    });
    const emitSpy = vi.spyOn(component.currentFolderChanged, 'emit');

    component.openEntry(folderFile);

    expect(component.foldersStack()).toEqual([currentFolder]);
    expect(emitSpy).toHaveBeenCalledWith({
      id: 'sub',
      kind: FileKind.Folder,
      name: 'Sub',
      node: '',
      path: '/folder-1/sub',
      provider: FileProvider.OsfStorage,
      links: {
        newFolder: '/sub-upload?kind=folder',
        storageAddons: '',
        upload: '/sub-upload',
        filesLink: '/sub-files',
        download: '/sub-upload',
      },
    });
  });

  it('should open parent folder from stack', () => {
    setup();
    const emitSpy = vi.spyOn(component.currentFolderChanged, 'emit');
    const parent: FileFolderModel = { ...currentFolder, id: 'parent', name: 'Parent', path: '/parent' };
    component.foldersStack.set([parent, currentFolder]);

    component.openParentFolder();

    expect(component.foldersStack()).toEqual([parent]);
    expect(emitSpy).toHaveBeenCalledWith(currentFolder);
  });

  it('should emit loadFiles on lazy load when end reached', () => {
    setup();
    const emitSpy = vi.spyOn(component.loadFiles, 'emit');
    fixture.componentRef.setInput(
      'files',
      Array.from({ length: 10 }).map((_, idx) => FileModelMock.simple({ id: `f-${idx}` }))
    );
    fixture.componentRef.setInput('totalCount', 25);
    fixture.detectChanges();

    component.onLazyLoad({ first: 0, last: 9 });

    expect(emitSpy).toHaveBeenCalledWith({ link: '/files-link', page: 2 });
  });

  it('should emit selected range with shift key and selected node', () => {
    setup();
    const files = [
      FileModelMock.simple({ id: 'f1' }),
      FileModelMock.simple({ id: 'f2' }),
      FileModelMock.simple({ id: 'f3' }),
    ];
    fixture.componentRef.setInput('files', files);
    fixture.detectChanges();
    component.lastSelectedFile = files[0];
    const emitSpy = vi.spyOn(component.fileSelected, 'emit');

    component.onNodeSelect({
      node: { data: files[2] },
      originalEvent: { shiftKey: true } as PointerEvent,
    });

    expect(emitSpy).toHaveBeenNthCalledWith(1, files[0]);
    expect(emitSpy).toHaveBeenNthCalledWith(2, files[1]);
    expect(emitSpy).toHaveBeenNthCalledWith(3, files[2]);
    expect(component.lastSelectedFile).toBe(files[2]);
  });

  it('should emit dropMove for folder drop and select drag file if missing', () => {
    setup();
    const dragFile = FileModelMock.simple({ id: 'drag' });
    const selectedFile = FileModelMock.simple({ id: 'sel' });
    const dropFolder = FileModelMock.simple({ id: 'dest', kind: FileKind.Folder });
    fixture.componentRef.setInput('selectedFiles', [selectedFile]);
    fixture.detectChanges();
    const selectSpy = vi.spyOn(component.fileSelected, 'emit');
    const moveSpy = vi.spyOn(component.dropMove, 'emit');

    component.onNodeDrop({
      dragNode: { data: dragFile },
      dropNode: { data: dropFolder },
    });

    expect(selectSpy).toHaveBeenCalledWith(dragFile);
    expect(moveSpy).toHaveBeenCalledWith({ files: [selectedFile, dragFile], destination: dropFolder });
  });

  it('should ignore node drop when destination is not folder', () => {
    setup();
    const moveSpy = vi.spyOn(component.dropMove, 'emit');

    component.onNodeDrop({
      dragNode: { data: FileModelMock.simple({ id: 'drag' }) },
      dropNode: { data: FileModelMock.simple({ id: 'dest', kind: FileKind.File }) },
    });

    expect(moveSpy).not.toHaveBeenCalled();
  });

  it('should trigger move and copy menu actions', () => {
    setup();
    const file = FileModelMock.simple({ id: 'f1' });
    const emitSpy = vi.spyOn(component.menuMoveCopy, 'emit');

    component.onFileMenuAction({ value: FileMenuType.Move }, file);
    component.onFileMenuAction({ value: FileMenuType.Copy }, file);

    expect(emitSpy).toHaveBeenNthCalledWith(1, { file, action: MoveCopyAction.Move });
    expect(emitSpy).toHaveBeenNthCalledWith(2, { file, action: MoveCopyAction.Copy });
  });

  it('should download folder from file menu action', () => {
    setup();
    const file = FileModelMock.simple({
      kind: FileKind.Folder,
      links: { ...FileModelMock.simple().links, upload: '/upload-folder' },
    });

    component.onFileMenuAction({ value: FileMenuType.Download }, file);

    expect(fileDownloadService.downloadFileOrFolder).toHaveBeenCalledWith({
      resourceId: 'node-1',
      resourceType: CurrentResourceType.Projects,
      file,
    });
  });

  it('should open share link in new tab for non self target', () => {
    setup();
    const file = FileModelMock.simple({ links: { ...FileModelMock.simple().links, html: '/html' } });
    filesShareEmbedService.getShareLink.mockReturnValue({ link: 'https://x.test', target: '_blank' });
    const openSpy = vi.spyOn(window, 'open').mockReturnValue({ focus: vi.fn() } as unknown as Window);

    component.onFileMenuAction({ value: FileMenuType.Share, data: { type: 'twitter' } }, file);

    expect(openSpy).toHaveBeenCalledWith('https://x.test', '_blank', 'noopener,noreferrer');
  });

  it('should copy embed on embed menu action', () => {
    setup();
    const file = FileModelMock.simple({ links: { ...FileModelMock.simple().links, render: 'https://render.test' } });

    component.onFileMenuAction({ value: FileMenuType.Embed, data: { type: 'dynamic' } }, file);

    expect(filesShareEmbedService.copyEmbedToClipboard).toHaveBeenCalledWith('https://render.test', 'dynamic');
  });
});
