import { ResourceType } from '@osf/shared/enums';

import { FileInfoItem } from '../models';

export const FILE_BROWSER_INFO_ITEMS: FileInfoItem[] = [
  {
    titleKey: 'files.filesBrowserDialog.seeAllFiles',
    descriptionKey: 'files.filesBrowserDialog.seeAllFilesDescription',
    showForResourceTypes: [ResourceType.Project, ResourceType.Registration],
  },
  {
    titleKey: 'files.filesBrowserDialog.selectFilesFolders',
    descriptionKey: 'files.filesBrowserDialog.selectFilesFoldersDescription',
    showForResourceTypes: [ResourceType.Project],
  },
  {
    titleKey: 'files.filesBrowserDialog.openViewFiles',
    descriptionKey: 'files.filesBrowserDialog.openViewFilesDescription',
    showForResourceTypes: [ResourceType.Project, ResourceType.Registration],
  },
  {
    titleKey: 'files.filesBrowserDialog.upload',
    descriptionKey: 'files.filesBrowserDialog.uploadDescription',
    showForResourceTypes: [ResourceType.Project],
  },
  {
    titleKey: 'files.filesBrowserDialog.createFolder',
    descriptionKey: 'files.filesBrowserDialog.createFolderDescription',
    showForResourceTypes: [ResourceType.Project],
  },
  {
    titleKey: 'files.filesBrowserDialog.renameFolderFile',
    descriptionKey: 'files.filesBrowserDialog.renameFolderFileDescription',
    showForResourceTypes: [ResourceType.Project],
  },
  {
    titleKey: 'files.filesBrowserDialog.move',
    descriptionKey: 'files.filesBrowserDialog.moveDescription',
    showForResourceTypes: [ResourceType.Project],
  },
  {
    titleKey: 'files.filesBrowserDialog.copy',
    descriptionKey: 'files.filesBrowserDialog.copyDescription',
    showForResourceTypes: [ResourceType.Project],
  },
  {
    titleKey: 'files.filesBrowserDialog.downloadAllFilesZip',
    descriptionKey: 'files.filesBrowserDialog.downloadAllFilesZipDescription',
    showForResourceTypes: [ResourceType.Project, ResourceType.Registration],
  },
  {
    titleKey: 'files.filesBrowserDialog.downloadFolderZip',
    descriptionKey: 'files.filesBrowserDialog.downloadFolderZipDescription',
    showForResourceTypes: [ResourceType.Project, ResourceType.Registration],
  },
  {
    titleKey: 'files.filesBrowserDialog.downloadFile',
    descriptionKey: 'files.filesBrowserDialog.downloadFileDescription',
    showForResourceTypes: [ResourceType.Project, ResourceType.Registration],
  },
];
