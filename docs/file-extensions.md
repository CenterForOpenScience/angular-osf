# File Extensions

Plugin architecture for adding custom actions to the file browser.

## Overview

Extensions are placed in `src/app/extensions/` and managed via `extensions.config.ts`.

## FileActionExtension

```typescript
interface FileActionExtension {
  id: string;
  label: string;
  icon: string;
  command: (ctx: FileActionContext) => void;
  parentId?: string;
  position?: 'start' | 'end' | number;
  visible?: (ctx: FileActionContext) => boolean;
  disabled?: (ctx: FileActionContext) => boolean;
}
```

### parentId

If `parentId` is set, the extension appears only in that submenu (e.g., `'share'`).
If not set, the extension appears in both menu and toolbar.

### FileActionContext

```typescript
interface FileActionContext {
  target: FileModel | FileDetailsModel | FileFolderModel;
  location: 'file-list' | 'file-detail';
  isViewOnly: boolean;
  canWrite: boolean;
}
```

## Example: Submenu Extension

```typescript
export function copyLinksExtensionFactory(): FileActionExtension[] {
  return [
    {
      id: 'copy-link',
      label: 'Copy Link',
      icon: 'fas fa-link',
      command: (ctx) => {
        navigator.clipboard.writeText(ctx.target.links.html);
      },
      parentId: 'share',  // appears in Share submenu only
      position: 'end',
      visible: (ctx) => ctx.target.kind === 'file',
      disabled: (ctx) => ctx.isViewOnly,
    },
  ];
}
```

> **Note:** Context menus honor `position` exactly (for example, `'start'` inserts before built-in items). Top-level toolbars append extensions after the core OSF buttons but still keep extension-to-extension ordering based on `position`. Design UX with that constraint in mind.

## Example: Menu + Toolbar Extension

```typescript
export function createFileExtensionFactory(config: Config): FileActionExtension[] {
  return [
    {
      id: 'create-file',
      label: 'Create File',
      icon: 'fas fa-file-plus',
      command: (ctx) => {
        window.open(`${config.editorUrl}?path=${ctx.target.path}`, '_blank');
      },
      // no parentId: appears in both menu and toolbar
      position: 'end',
      visible: (ctx) =>
        ctx.location === 'file-list' &&
        ctx.target.kind === 'folder' &&
        !ctx.isViewOnly &&
        ctx.canWrite,
    },
  ];
}
```

## Configuration

The extension configuration is managed via `extensions.config.ts`, which is generated at build time.

### File Structure

```
src/app/
  extensions.config.ts          # Generated (not in git)
  extensions.config.default.ts  # Default config (in git)
```

### Build-time Configuration

By default, `extensions.config.default.ts` is used. To use a custom configuration:

```bash
EXTENSIONS_CONFIG=/path/to/my-extensions.config.ts npm run build
```

The `scripts/setup-extensions.js` helper runs before `npm run build`, `npm start`, and `npm test` (see the `prebuild` / `prestart` / `pretest` npm scripts) and handles this:
- If `EXTENSIONS_CONFIG` is set, copies that file
- Otherwise, copies `extensions.config.default.ts`

## Registration

### extensions.config.ts

```typescript
export const extensionConfig: ExtensionConfig[] = [
  {
    load: () => import('./extensions/copy-links'),
    factory: 'copyLinksExtensionFactory',
    enabled: true,
  },
  {
    load: () => import('./extensions/onlyoffice'),
    factory: 'editByOnlyOfficeExtensionFactory',
    enabled: true,
    config: { editorUrl: 'https://...' },
  },
  {
    load: () => import('./extensions/onlyoffice'),
    factory: 'createFileExtensionFactory',
    enabled: true,
    config: { editorUrl: 'https://...' },
  },
];
```

