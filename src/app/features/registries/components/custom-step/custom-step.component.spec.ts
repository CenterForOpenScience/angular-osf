import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InfoIconComponent } from '@osf/shared/components/info-icon/info-icon.component';
import { FieldType } from '@osf/shared/enums/field-type.enum';
import { ToastService } from '@osf/shared/services/toast.service';
import { FileModel } from '@shared/models/files/file.model';
import { FilePayloadJsonApi } from '@shared/models/files/file-payload-json-api.model';
import { PageSchema } from '@shared/models/registration/page-schema.model';

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
  provider?: string;
}

describe('CustomStepComponent', () => {
  function createPage(
    questions: PageSchema['questions'] = [],
    sections: PageSchema['sections'] = undefined
  ): PageSchema {
    return { id: 'p', title: 'P', questions, sections };
  }

  function setup(overrides: SetupOverrides = {}) {
    const routeBuilder = ActivatedRouteMockBuilder.create().withParams(overrides.routeParams ?? { step: 1 });
    if (overrides.hasParent === false) {
      routeBuilder.withNoParent();
    }

    const mockRouter = RouterMockBuilder.create().withUrl('/registries/drafts/id/1').build();
    const toastMock = ToastServiceMock.simple();

    const defaultSignals: SignalOverride[] = [
      { selector: RegistriesSelectors.getPagesSchema, value: overrides.pages ?? [MOCK_REGISTRIES_PAGE] },
      { selector: RegistriesSelectors.getStepsState, value: overrides.stepsState ?? {} },
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
    fixture.componentRef.setInput('provider', overrides.provider ?? 'provider');
    fixture.detectChanges();
    return { component, fixture, store, routeBuilder, mockRouter, toastMock };
  }

  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  it('should emit back on first step', () => {
    const { component } = setup();
    const backSpy = vi.spyOn(component.back, 'emit');
    component.goBack();
    expect(backSpy).toHaveBeenCalled();
  });

  it('should navigate to previous step on step > 1', () => {
    const { component, mockRouter } = setup();
    component.step.set(2);
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../', 1], { relativeTo: expect.anything() });
  });

  it('should navigate to next step within pages', () => {
    const { component, mockRouter } = setup({ pages: [MOCK_REGISTRIES_PAGE, MOCK_REGISTRIES_PAGE] });
    component.goNext();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../', 2], { relativeTo: expect.anything() });
  });

  it('should emit next on last step', () => {
    const { component } = setup();
    const nextSpy = vi.spyOn(component.next, 'emit');
    component.step.set(1);
    component.goNext();
    expect(nextSpy).toHaveBeenCalled();
  });

  it('should dispatch updateStepState on ngOnDestroy', () => {
    const { component, store } = setup();
    (store.dispatch as Mock).mockClear();
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(UpdateStepState));
  });

  it('should emit updateAction and dispatch setUpdatedFields when fields changed', () => {
    const { component, store } = setup();
    const emitSpy = vi.spyOn(component.updateAction, 'emit');
    component['stepForm'].get('field1')?.setValue('changed');
    (store.dispatch as Mock).mockClear();

    component.ngOnDestroy();

    expect(emitSpy).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new SetUpdatedFields({ field1: 'changed' }));
  });

  it('should not emit updateAction when no fields changed', () => {
    const { component, store } = setup();
    const emitSpy = vi.spyOn(component.updateAction, 'emit');
    (store.dispatch as Mock).mockClear();

    component.ngOnDestroy();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(SetUpdatedFields));
  });

  it('should skip saveStepState when form has no controls', () => {
    const { component, store } = setup();
    component.stepForm = new FormGroup({});
    (store.dispatch as Mock).mockClear();

    component.ngOnDestroy();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should attach file and emit updateAction', () => {
    const { component } = setup();
    const emitSpy = vi.spyOn(component.updateAction, 'emit');
    const mockFile = {
      id: 'new-file',
      name: 'new.txt',
      links: { html: 'http://html', download: 'http://dl' },
      extra: { hashes: { sha256: 'abc' } },
    } as FileModel;

    component.onAttachFile(mockFile, 'field1');

    expect(component.attachedFiles['field1'].length).toBe(1);
    expect(emitSpy).toHaveBeenCalled();
    expect(emitSpy.mock.calls[0][0]['field1'][0].file_id).toBe('new-file');
  });

  it('should not attach duplicate file', () => {
    const { component } = setup();
    component.attachedFiles['field1'] = [{ file_id: 'file-1', name: 'existing.txt' }];
    const emitSpy = vi.spyOn(component.updateAction, 'emit');

    component.onAttachFile({ id: 'file-1' } as FileModel, 'field1');

    expect(component.attachedFiles['field1'].length).toBe(1);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should show warning when attachment limit reached', () => {
    const { component, toastMock } = setup();
    component.attachedFiles['field1'] = Array.from({ length: 5 }, (_, i) => ({ file_id: `f-${i}`, name: `f-${i}` }));

    const mockFile = {
      id: 'new',
      name: 'new.txt',
      links: { html: '', download: '' },
      extra: { hashes: { sha256: '', md5: '' } },
    } as FileModel;
    component.onAttachFile(mockFile, 'field1');

    expect(toastMock.showWarn).toHaveBeenCalledWith('shared.files.limitText');
    expect(component.attachedFiles['field1'].length).toBe(5);
  });

  it('should remove file and emit updateAction', () => {
    const { component } = setup();
    const emitSpy = vi.spyOn(component.updateAction, 'emit');
    component.attachedFiles['field1'] = [
      { file_id: 'f1', name: 'a' },
      { file_id: 'f2', name: 'b' },
    ];

    component.removeFromAttachedFiles({ file_id: 'f1', name: 'a' }, 'field1');

    expect(component.attachedFiles['field1'].length).toBe(1);
    expect(component.attachedFiles['field1'][0].file_id).toBe('f2');
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should skip non-existent questionKey', () => {
    const { component } = setup();
    const emitSpy = vi.spyOn(component.updateAction, 'emit');
    component.removeFromAttachedFiles({ file_id: 'f1' }, 'nonexistent');
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should save step state and update step on route param change', () => {
    const { component, store, routeBuilder } = setup();
    (store.dispatch as Mock).mockClear();
    routeBuilder.withParams({ step: 2 });

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(UpdateStepState));
    expect(component.step()).toBe(2);
  });

  it('should mark form touched when stepsState has invalid for current step', () => {
    const { component } = setup({
      stepsState: { 1: { invalid: true, touched: true } },
    });
    expect(component['stepForm'].get('field1')?.touched).toBe(true);
  });

  it('should initialize checkbox control with empty array default', () => {
    const { component } = setup({
      pages: [
        createPage([
          { id: 'q', displayText: '', responseKey: 'cbField', fieldType: FieldType.Checkbox, required: true },
        ]),
      ],
      stepsData: {},
    });
    expect(component['stepForm'].get('cbField')?.value).toEqual([]);
  });

  it('should initialize radio control with required validator', () => {
    const { component } = setup({
      pages: [
        createPage([
          { id: 'q', displayText: '', responseKey: 'radioField', fieldType: FieldType.Radio, required: true },
        ]),
      ],
      stepsData: {},
    });
    expect(component['stepForm'].get('radioField')?.valid).toBe(false);
  });

  it('should initialize file control and populate attachedFiles', () => {
    const files: FilePayloadJsonApi[] = [
      { file_id: 'f1', file_name: 'doc.pdf', file_urls: { html: '', download: '' }, file_hashes: { sha256: '' } },
    ];
    const { component } = setup({
      pages: [
        createPage([
          { id: 'q', displayText: '', responseKey: 'fileField', fieldType: FieldType.File, required: false },
        ]),
      ],
      stepsData: { fileField: files },
    });

    expect(component.attachedFiles['fileField'].length).toBe(1);
    expect(component.attachedFiles['fileField'][0].name).toBe('doc.pdf');
  });

  it('should skip unknown field types', () => {
    const { component } = setup({
      pages: [
        createPage([
          { id: 'q', displayText: '', responseKey: 'unknownField', fieldType: 'unknown' as FieldType, required: false },
        ]),
      ],
      stepsData: {},
    });
    expect(component['stepForm'].get('unknownField')).toBeNull();
  });

  it('should include section questions', () => {
    const { component } = setup({
      pages: [
        createPage(
          [],
          [
            {
              id: 's1',
              title: 'S',
              questions: [
                { id: 'q', displayText: '', responseKey: 'secField', fieldType: FieldType.Text, required: false },
              ],
            },
          ]
        ),
      ],
      stepsData: { secField: 'val' },
    });

    expect(component['stepForm'].get('secField')).toBeDefined();
    expect(component['stepForm'].get('secField')?.value).toBe('val');
  });
});
