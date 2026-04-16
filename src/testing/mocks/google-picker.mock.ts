export interface GooglePickerViewMock {
  setSelectFolderEnabled: ReturnType<typeof vi.fn>;
  setMimeTypes: ReturnType<typeof vi.fn>;
  setIncludeFolders: ReturnType<typeof vi.fn>;
  setParent: ReturnType<typeof vi.fn>;
}

export interface GooglePickerBuilderMock {
  setDeveloperKey: ReturnType<typeof vi.fn>;
  setAppId: ReturnType<typeof vi.fn>;
  addView: ReturnType<typeof vi.fn>;
  setTitle: ReturnType<typeof vi.fn>;
  setOAuthToken: ReturnType<typeof vi.fn>;
  setCallback: ReturnType<typeof vi.fn>;
  enableFeature: ReturnType<typeof vi.fn>;
  build: ReturnType<typeof vi.fn>;
}

export interface GooglePickerMockSetup {
  docsViewMock: GooglePickerViewMock;
  pickerBuilderMock: GooglePickerBuilderMock;
  pickerSetVisibleMock: ReturnType<typeof vi.fn>;
}

export function setupGooglePickerMock(): GooglePickerMockSetup {
  const docsViewMock: GooglePickerViewMock = {
    setSelectFolderEnabled: vi.fn(),
    setMimeTypes: vi.fn(),
    setIncludeFolders: vi.fn(),
    setParent: vi.fn(),
  };

  const pickerSetVisibleMock = vi.fn();
  const pickerBuilderMock: GooglePickerBuilderMock = {
    setDeveloperKey: vi.fn().mockReturnThis(),
    setAppId: vi.fn().mockReturnThis(),
    addView: vi.fn().mockReturnThis(),
    setTitle: vi.fn().mockReturnThis(),
    setOAuthToken: vi.fn().mockReturnThis(),
    setCallback: vi.fn().mockReturnThis(),
    enableFeature: vi.fn().mockReturnThis(),
    build: vi.fn().mockReturnValue({ setVisible: pickerSetVisibleMock }),
  };

  Object.defineProperty(window, 'google', {
    configurable: true,
    writable: true,
    value: {
      picker: {
        Action: { PICKED: 'picked' },
        Feature: { MULTISELECT_ENABLED: 'MULTISELECT_ENABLED' },
        ViewId: { DOCS: 'DOCS' },
        DocsView: vi.fn().mockImplementation(function DocsViewMock() {
          return docsViewMock;
        }),
        PickerBuilder: vi.fn().mockImplementation(function PickerBuilderMock() {
          return pickerBuilderMock;
        }),
      },
    },
  });

  return {
    docsViewMock,
    pickerBuilderMock,
    pickerSetVisibleMock,
  };
}
