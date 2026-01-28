import { InjectionToken } from '@angular/core';

import { FileDetailsModel, FileModel } from '@osf/shared/models/files/file.model';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';

export type FileActionTarget = FileModel | FileDetailsModel | FileFolderModel;

/**
 * Context passed to visible, disabled, and command functions.
 */
export interface FileActionContext {
  /** Current file or folder */
  target: FileActionTarget;
  /** Where the action is being rendered */
  location: 'file-list' | 'file-detail';
  /** Whether the user is viewing via a view-only link */
  isViewOnly: boolean;
  /** Whether the user has write access */
  canWrite: boolean;
}

export interface FileActionExtension {
  /** Unique identifier */
  id: string;

  /** Display label */
  label: string;

  /** Icon class (e.g., 'fas fa-link') */
  icon: string;

  /** Click handler */
  command: (ctx: FileActionContext) => void;

  /**
   * Parent menu ID for submenu insertion.
   * If set, extension appears only in that submenu (e.g., 'share').
   * If not set, extension appears in both menu and toolbar.
   */
  parentId?: string;

  /**
   * Position to insert
   * - 'start': beginning
   * - 'end': end (default)
   * - number: specific index
   */
  position?: 'start' | 'end' | number;

  /** Visibility condition */
  visible?: (ctx: FileActionContext) => boolean;

  /** Disabled condition */
  disabled?: (ctx: FileActionContext) => boolean;
}

export const FILE_ACTION_EXTENSIONS = new InjectionToken<FileActionExtension[]>('FileActionExtensions');
