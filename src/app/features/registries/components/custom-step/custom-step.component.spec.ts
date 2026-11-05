import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user/user.selectors';
import { InfoIconComponent } from '@osf/shared/components/info-icon/info-icon.component';
import { FILE_COUNT_ATTACHMENTS_LIMIT } from '@osf/shared/constants/files-limits.const';
import { FieldType } from '@osf/shared/enums/field-type.enum';
import { FileModel } from '@osf/shared/models/files/file.model';
import { FilePayloadJsonApi } from '@osf/shared/models/files/file-payload-json-api.model';
import { PageSchema, Question } from '@osf/shared/models/registration/page-schema.model';
import { ToastService } from '@osf/shared/services/toast.service';

import { FileModelMock } from '@testing/mocks/file.model.mock';
import { MOCK_REGISTRIES_PAGE, MOCK_STEPS_DATA } from '@testing/mocks/registries.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock } from '@testing/providers/toast-provider.mock';

import { RegistriesSelectors, SetUpdatedFields, UpdateStepState } from '../../store';
import { FilesControlComponent } from '../files-control/files-control.component';

import { CustomStepComponent } from './custom-step.component';

type StepsState = Record<string, { invalid: boolean; touched: boolean }>;

interface SetupOverrides extends BaseSetupOverrides {
  pages?: PageSchema[];
  stepsState?: StepsState;
  stepsData?: Record<string, unknown>;
  filesLink?: string;
  projectId?: string;
  serializedUrl?: string;
  urlTree?: UrlTree;
}

describe('CustomStepComponent', () => {
  const filePayload: FilePayloadJsonApi = {
    file_id: 'f1',
    file_name: 'doc.pdf',
    file_urls: { html: '', download: '' },
    file_hashes: { sha256: '' },
  };

  function createPage(
    questions: PageSchema['questions'] = [],
    sections: PageSchema['sections'] = undefined
  ): PageSchema {
    return { id: 'p', title: 'P', questions, sections };
  }

  function createQuestion(overrides: Partial<Question> & { responseKey: string; fieldType: FieldType }): Question {
    return {
      id: overrides.responseKey,
      displayText: '',
      required: false,
      ...overrides,
    };
  }

  function setup(overrides: SetupOverrides = {}) {
    const routeBuilder = ActivatedRouteMockBuilder.create().withParams(
      overrides.routeParams ?? { step: '1', id: 'draft-1' }
    );
    if (overrides.hasParent === false) {
      routeBuilder.withNoParent();
    }

    const mockRouter = RouterMockBuilder.create()
      .withUrl('/registries/drafts/id/1')
      .withCreateUrlTree(vi.fn().mockReturnValue(overrides.urlTree ?? ({} as UrlTree)))
      .withSerializeUrl(vi.fn().mockReturnValue(overrides.serializedUrl ?? '/'))
      .build();
    const toastMock = ToastServiceMock.simple();

    const defaultSignals: SignalOverride[] = [
      { selector: RegistriesSelectors.getPagesSchema, value: overrides.pages ?? [MOCK_REGISTRIES_PAGE] },
      { selector: RegistriesSelectors.getStepsState, value: overrides.stepsState ?? {} },
      { selector: UserSelectors.isProjectCreationDisabled, value: false },
    ];
    const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

    TestBed.configureTestingModule({
      imports: [CustomStepComponent, ...MockComponents(InfoIconComponent, FilesControlComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(ToastService, toastMock),
        MockProvider(ActivatedRoute, routeBuilder.build()),
        MockProvider(Router, mockRouter),
        provideMockStore({ signals }),
      ],
    });

    const store = TestBed.inject(Store);
    const fixture = TestBed.createComponent(CustomStepComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('stepsData', overrides.stepsData ?? MOCK_STEPS_DATA);
    fixture.componentRef.setInput('filesLink', overrides.filesLink ?? 'files-link');
    fixture.componentRef.setInput('projectId', overrides.projectId ?? 'project');
    fixture.detectChanges();
    return { component, fixture, store, routeBuilder, mockRouter, toastMock };
  }

  it('should emit back on first step and navigate to the previous step later', () => {
    const { component, mockRouter } = setup();
    const backSpy = vi.spyOn(component.back, 'emit');

    component.goBack();
    expect(backSpy).toHaveBeenCalled();

    component.step.set(2);
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../', 1], { relativeTo: expect.anything() });
  });

  it('should navigate to the next step or emit next on the last step', () => {
    const { component, mockRouter } = setup({ pages: [MOCK_REGISTRIES_PAGE, MOCK_REGISTRIES_PAGE] });
    const nextSpy = vi.spyOn(component.next, 'emit');

    component.goNext();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../', 2], { relativeTo: expect.anything() });

    component.step.set(2);
    component.goNext();
    expect(nextSpy).toHaveBeenCalled();
  });

  it('should emit updateAction and SetUpdatedFields when fields changed on destroy', () => {
    const { component, store } = setup();
    const emitSpy = vi.spyOn(component.updateAction, 'emit');
    component.stepForm.get('field1')?.setValue('changed');
    (store.dispatch as Mock).mockClear();

    component.ngOnDestroy();

    expect(emitSpy).toHaveBeenCalledWith(expect.objectContaining({ field1: 'changed' }));
    expect(store.dispatch).toHaveBeenCalledWith(new SetUpdatedFields({ field1: 'changed' }));
    expect(store.dispatch).toHaveBeenCalledWith(new UpdateStepState('1', false, true));
  });

  it('should dispatch step state without updateAction when nothing changed', () => {
    const { component, store } = setup();
    const emitSpy = vi.spyOn(component.updateAction, 'emit');
    (store.dispatch as Mock).mockClear();

    component.ngOnDestroy();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(SetUpdatedFields));
    expect(store.dispatch).toHaveBeenCalledWith(new UpdateStepState('1', false, true));
  });

  it('should skip save when the form has no controls', () => {
    const { component, store } = setup();
    component.stepForm = new FormGroup({});
    (store.dispatch as Mock).mockClear();

    component.ngOnDestroy();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should not treat attached file display names as field changes', () => {
    const { component } = setup({
      pages: [createPage([createQuestion({ responseKey: 'files', fieldType: FieldType.File })])],
      stepsData: { files: [filePayload] },
    });
    const emitSpy = vi.spyOn(component.updateAction, 'emit');

    component.ngOnDestroy();

    expect(component.attachedFiles['files'][0].name).toBe('doc.pdf');
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should save state and update step and draftId on route param change', () => {
    const { component, store, routeBuilder } = setup({ routeParams: { step: '1', id: 'draft-1' } });
    (store.dispatch as Mock).mockClear();

    routeBuilder.withParams({ step: '2', id: 'draft-2' });

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(UpdateStepState));
    expect(component.step()).toBe(2);
    expect(component.draftId()).toBe('draft-2');
  });

  it('should initialize page and section controls and skip unknown types', () => {
    const { component } = setup({
      pages: [
        createPage(
          [
            createQuestion({ responseKey: 'cbField', fieldType: FieldType.Checkbox, required: true }),
            createQuestion({ responseKey: 'radioField', fieldType: FieldType.Radio, required: true }),
            createQuestion({ responseKey: 'fileField', fieldType: FieldType.File }),
            createQuestion({ responseKey: 'unknownField', fieldType: 'unknown' as FieldType }),
          ],
          [
            {
              id: 's1',
              title: 'S',
              questions: [createQuestion({ responseKey: 'secField', fieldType: FieldType.Text })],
            },
          ]
        ),
      ],
      stepsData: { fileField: [filePayload], secField: 'val' },
    });

    expect(component.stepForm.get('cbField')?.value).toEqual([]);
    expect(component.stepForm.get('radioField')?.valid).toBe(false);
    expect(component.attachedFiles['fileField'][0].name).toBe('doc.pdf');
    expect(component.stepForm.get('unknownField')).toBeNull();
    expect(component.stepForm.get('secField')?.value).toBe('val');
  });

  it('should mark the form touched when the current step is invalid', () => {
    const { component } = setup({
      stepsState: { 1: { invalid: true, touched: true } },
    });
    expect(component.stepForm.get('field1')?.touched).toBe(true);
  });

  it('should reset attachedFiles when navigating to another page', async () => {
    const { component, fixture, routeBuilder } = setup({
      pages: [
        createPage([createQuestion({ responseKey: 'files', fieldType: FieldType.File })]),
        createPage([createQuestion({ responseKey: 'title', fieldType: FieldType.Text })]),
      ],
      stepsData: { files: [filePayload], title: '' },
      routeParams: { step: '1', id: 'draft-1' },
    });

    expect(component.attachedFiles['files']?.length).toBe(1);

    routeBuilder.withParams({ step: '2', id: 'draft-1' });
    await fixture.whenStable();

    expect(component.attachedFiles['files']).toBeUndefined();
    expect(component.stepForm.get('title')).toBeDefined();
  });

  it('should use the no-project file upload description when project creation is disabled', () => {
    const { component } = setup({
      selectorOverrides: [{ selector: UserSelectors.isProjectCreationDisabled, value: true }],
    });
    expect(component.fileUploadDescription()).toBe('shared.files.descriptionNoProject');
  });

  it('should attach a file and emit a mapped form payload', () => {
    const { component } = setup({
      pages: [
        createPage([
          createQuestion({ responseKey: 'title', fieldType: FieldType.Text }),
          createQuestion({ responseKey: 'files', fieldType: FieldType.File }),
        ]),
      ],
      stepsData: { title: 'a', files: [] },
    });
    const emitSpy = vi.spyOn(component.updateAction, 'emit');
    const mockFile = FileModelMock.simple({
      id: 'new-file',
      name: 'new.txt',
      links: { ...FileModelMock.simple().links, html: 'http://html', download: 'http://dl' },
      extra: { hashes: { sha256: 'abc', md5: '' }, downloads: 0 },
    });

    component.onAttachFile(mockFile, 'files');

    expect(component.attachedFiles['files'].length).toBe(1);
    expect(emitSpy).toHaveBeenCalledWith({
      title: 'a',
      files: [
        {
          file_id: 'new-file',
          file_name: 'new.txt',
          file_urls: { html: 'http://html', download: 'http://dl' },
          file_hashes: { sha256: 'abc' },
        },
      ],
    });
  });

  it('should not attach a duplicate file', () => {
    const { component } = setup({
      pages: [createPage([createQuestion({ responseKey: 'files', fieldType: FieldType.File })])],
      stepsData: { files: [] },
    });
    component.attachedFiles['files'] = [{ file_id: 'file-1', name: 'existing.txt' }];
    const emitSpy = vi.spyOn(component.updateAction, 'emit');

    component.onAttachFile(FileModelMock.simple({ id: 'file-1' }), 'files');

    expect(component.attachedFiles['files'].length).toBe(1);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should warn when the attachment limit is reached', () => {
    const { component, toastMock } = setup({
      pages: [createPage([createQuestion({ responseKey: 'files', fieldType: FieldType.File })])],
      stepsData: { files: [] },
    });
    component.attachedFiles['files'] = Array.from({ length: FILE_COUNT_ATTACHMENTS_LIMIT }, (_, i) => ({
      file_id: `f-${i}`,
      name: `f-${i}`,
    }));

    component.onAttachFile(FileModelMock.simple({ id: 'new' }), 'files');

    expect(toastMock.showWarn).toHaveBeenCalledWith('shared.files.limitText');
    expect(component.attachedFiles['files'].length).toBe(FILE_COUNT_ATTACHMENTS_LIMIT);
  });

  it('should remove a file and emit the mapped question payload', () => {
    const { component } = setup({
      pages: [createPage([createQuestion({ responseKey: 'files', fieldType: FieldType.File })])],
      stepsData: { files: [] },
    });
    const emitSpy = vi.spyOn(component.updateAction, 'emit');
    component.attachedFiles['files'] = [
      { ...filePayload, name: 'a' },
      {
        file_id: 'f2',
        file_name: 'b.pdf',
        file_urls: { html: '', download: '' },
        file_hashes: { sha256: '' },
        name: 'b',
      },
    ];

    component.removeFromAttachedFiles('f1', 'files');

    expect(component.attachedFiles['files']).toEqual([expect.objectContaining({ file_id: 'f2', name: 'b' })]);
    expect(emitSpy).toHaveBeenCalledWith({
      files: [
        {
          file_id: 'f2',
          file_name: 'b.pdf',
          file_urls: { html: '', download: '' },
          file_hashes: { sha256: '' },
        },
      ],
    });
  });

  it('should skip remove when the question key is missing', () => {
    const { component } = setup();
    const emitSpy = vi.spyOn(component.updateAction, 'emit');

    component.removeFromAttachedFiles('f1', 'nonexistent');

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should open file preview when draftId and guid exist', () => {
    const urlTree = {} as UrlTree;
    const { component, mockRouter } = setup({
      routeParams: { step: '1', id: 'draft-1' },
      urlTree,
      serializedUrl: '/draft-1/files/file-guid/preview',
    });
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.onOpenFile({ guid: 'file-guid' } as FileModel);

    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['draft-1', 'files', 'file-guid', 'preview']);
    expect(mockRouter.serializeUrl).toHaveBeenCalledWith(urlTree);
    expect(openSpy).toHaveBeenCalledWith('/draft-1/files/file-guid/preview', '_blank');
  });

  it('should not open file preview when guid is missing', () => {
    const { component } = setup({ routeParams: { step: '1', id: 'draft-1' } });
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.onOpenFile({ guid: null } as FileModel);

    expect(openSpy).not.toHaveBeenCalled();
  });
});
